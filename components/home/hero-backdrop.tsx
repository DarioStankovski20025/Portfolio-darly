"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The hero backdrop.
 *
 * A previous version of this file was static by design, after a pointer-reactive
 * dot canvas was removed for running a requestAnimationFrame loop behind the most
 * performance-sensitive part of the page. This version is pointer-reactive again,
 * but it does not reinstate that loop:
 *
 *   - no canvas, no rAF of its own — every moving layer is a framer motion value,
 *     and framer drives the whole app from one shared frameloop
 *   - no React state anywhere in the pointer path, so no re-renders
 *   - only `transform` and `transform-origin` are written per frame, both of
 *     which the compositor handles; nothing here triggers a raster
 *   - still no `filter: blur()` on anything large — the light fields stay plain
 *     radial gradients, which at this softness are indistinguishable from a
 *     blurred box and cost a fraction of it
 *
 * Order matters, back to front:
 *   1. graded base, so the top of the page is deeper than the bottom
 *   2. three colour fields as light sources, each following the cursor at its
 *      own lag — the lag differential is what reads as depth
 *   3. a grid, and a lens over it that bulges the lines around the pointer
 *   4. a tight glow riding just behind the cursor
 *   5. a horizon: one bright rule with the glow sitting on top of it
 *   6. grain over everything
 */

/**
 * Springs, ordered front to back by stiffness. The far field lags the cursor by
 * roughly 400ms, the near one 150ms, the glow 60ms. Do not flatten these into
 * one config — the difference between them *is* the parallax.
 */
const SPRING_FAR = { stiffness: 38, damping: 26, mass: 1.2 };
const SPRING_MID = { stiffness: 60, damping: 24, mass: 0.9 };
const SPRING_NEAR = { stiffness: 95, damping: 22, mass: 0.6 };
const SPRING_LENS = { stiffness: 150, damping: 26, mass: 0.55 };
const SPRING_GLOW = { stiffness: 220, damping: 28, mass: 0.4 };

/** Travel in px at the edge of the hero, per layer. 2b runs inverted. */
const TRAVEL_A = 46;
const TRAVEL_B = -34;
const TRAVEL_C = 22;

const LENS_SIZE = 620;
const LENS_HALF = LENS_SIZE / 2;
const LENS_SCALE = 1.13;
const GLOW_SIZE = 420;
const IDLE_MS = 2600;
const ORBIT_S = 26;

/**
 * The lens mask, and the glow's own gradient.
 *
 * Both live in inline styles rather than Tailwind arbitrary properties: a
 * leading `-` in `[-webkit-mask-image:…]` reads as Tailwind's negative-value
 * modifier, and these are static strings anyway, so there is nothing to gain
 * from putting them through the compiler.
 */
const LENS_MASK =
  "radial-gradient(circle at 50% 50%, #000 0%, #000 26%, transparent 70%)";

/** The lens grid, in sky rather than hairline so it reads as lit. */
const LENS_GRID =
  "linear-gradient(to right, rgba(85,184,255,0.42) 1px, transparent 1px)," +
  "linear-gradient(to bottom, rgba(85,184,255,0.42) 1px, transparent 1px)";

export function HeroBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  /**
   * `interactive` gates the pointer layers, `drifting` gates the idle orbit.
   * Both come from matchMedia in an effect rather than from `useReducedMotion()`
   * read during render — see the note on the render tree below.
   */
  const [interactive, setInteractive] = useState(false);
  const [drifting, setDrifting] = useState(false);

  const inView = useInView(rootRef, { amount: 0.1 });

  // Normalised pointer offset from the hero's centre, -1…1. Every light field
  // derives its own travel from this one pair.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // Absolute position within the hero, for the two layers that have to sit
  // *under* the cursor rather than merely lean towards it. Parked off-screen
  // until the first pointer event: starting at 0,0 would put them in the hero's
  // top-left corner and animate them diagonally across the screen on first move.
  const rawX = useMotionValue(-9999);
  const rawY = useMotionValue(-9999);

  const aX = useSpring(useTransform(px, (v) => v * TRAVEL_A), SPRING_FAR);
  const aY = useSpring(useTransform(py, (v) => v * TRAVEL_A), SPRING_FAR);
  const bX = useSpring(useTransform(px, (v) => v * TRAVEL_B), SPRING_MID);
  const bY = useSpring(useTransform(py, (v) => v * TRAVEL_B), SPRING_MID);
  const cX = useSpring(useTransform(px, (v) => v * TRAVEL_C), SPRING_NEAR);
  const cY = useSpring(useTransform(py, (v) => v * TRAVEL_C), SPRING_NEAR);

  const lensX = useSpring(rawX, SPRING_LENS);
  const lensY = useSpring(rawY, SPRING_LENS);
  const glowX = useSpring(rawX, SPRING_GLOW);
  const glowY = useSpring(rawY, SPRING_GLOW);

  /* ---------------- capability gates ---------------- */

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => {
      setInteractive(fine.matches && !calm.matches);
      setDrifting(!calm.matches);
    };

    evaluate();
    fine.addEventListener("change", evaluate);
    calm.addEventListener("change", evaluate);
    return () => {
      fine.removeEventListener("change", evaluate);
      calm.removeEventListener("change", evaluate);
    };
  }, []);

  /* ---------------- the lens ---------------- */

  /**
   * Two style writes per frame on one node.
   *
   * The inner grid is counter-translated by the same spring that moves the
   * window above it, so it stays anchored to the page while the window slides
   * over it — the lines do not travel with the cursor. Then `transform-origin`
   * is set to the cursor's position in the grid's own coordinate space, which is
   * what makes `scale()` displace by zero *at* the pointer and grow outward from
   * there. Scaling about the element centre instead — the obvious approach —
   * puts the displacement at the screen edges and none where anyone is looking.
   */
  const writeLens = useCallback(() => {
    const node = lensRef.current;
    if (!node) return;

    const x = lensX.get();
    const y = lensY.get();

    /*
      Where the cursor sits in this element's own untransformed coordinates.

      The window's box is offset by half its size (the centring margin) and this
      grid starts a further viewport up and to the left, so the pointer — which
      the window is centred on — lands at `half + viewport` plus the window's own
      travel. Get this wrong and the bulge drifts away from the cursor.
    */
    node.style.transformOrigin = `${x + LENS_HALF + window.innerWidth}px ${
      y + LENS_HALF + window.innerHeight
    }px`;
    node.style.transform = `translate3d(${-x}px, ${-y}px, 0) scale(${LENS_SCALE})`;
  }, [lensX, lensY]);

  useMotionValueEvent(lensX, "change", writeLens);
  useMotionValueEvent(lensY, "change", writeLens);

  /* ---------------- pointer + idle orbit ---------------- */

  useEffect(() => {
    // Off-screen or hidden: nothing here should be running. Without this the
    // orbit animates for the entire scroll depth of the page, on every device.
    if (!inView) return;

    const orbit: AnimationPlaybackControls[] = [];
    let idle = 0;

    const stopOrbit = () => {
      orbit.forEach((controls) => controls.stop());
      orbit.length = 0;
    };

    /**
     * A slow circle: x leads y by a quarter cycle. It drives the *source*
     * values, not the springs, which is what makes the handoff free — the
     * springs sit downstream and simply interpolate from wherever the orbit left
     * them to the new pointer target. No jump, no special case.
     */
    const startOrbit = () => {
      if (!drifting) return;
      stopOrbit();
      orbit.push(
        animate(px, [px.get(), 1, 0, -1, 0, px.get()], {
          duration: ORBIT_S,
          repeat: Infinity,
          ease: "linear",
        }),
        animate(py, [py.get(), 0, 1, 0, -1, py.get()], {
          duration: ORBIT_S,
          repeat: Infinity,
          ease: "linear",
        }),
      );
    };

    const onMove = (event: PointerEvent) => {
      const node = rootRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      stopOrbit();
      window.clearTimeout(idle);
      idle = window.setTimeout(startOrbit, IDLE_MS);

      px.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
      py.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
      rawX.set(event.clientX - rect.left);
      rawY.set(event.clientY - rect.top);
    };

    const onVisibility = () => {
      if (document.hidden) {
        stopOrbit();
        window.clearTimeout(idle);
      } else {
        startOrbit();
      }
    };

    startOrbit();
    document.addEventListener("visibilitychange", onVisibility);
    if (interactive) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    return () => {
      stopOrbit();
      window.clearTimeout(idle);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
    };
  }, [drifting, interactive, inView, px, py, rawX, rawY]);

  /*
    The tree below never branches on capability — the lens and glow are always
    rendered and are hidden with opacity instead. Conditionally mounting them
    would create two composited layers at the exact moment the intro curtain
    lifts, which is a visible hitch on the first thing anyone sees.
  */
  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* 1 — graded base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #030910 0%, #050c17 42%, #071426 100%)",
        }}
      />

      {/* 2 — light sources. `inset-[-8%]` rather than `inset-0`: these gradients
             are authored to reach the element edge, so translating a flush layer
             would drag a transparent edge into frame. */}
      <motion.div
        className="absolute inset-[-8%] will-change-transform"
        style={{
          x: aX,
          y: aY,
          background:
            "radial-gradient(120% 90% at 82% -10%, rgba(36,107,253,0.42) 0%, rgba(36,107,253,0.12) 34%, transparent 62%)",
        }}
      />
      <motion.div
        className="absolute inset-[-8%] will-change-transform"
        style={{
          x: bX,
          y: bY,
          background:
            "radial-gradient(90% 70% at 8% 105%, rgba(104,92,255,0.34) 0%, rgba(104,92,255,0.08) 40%, transparent 68%)",
        }}
      />
      <motion.div
        className="absolute inset-[-8%] will-change-transform"
        style={{
          x: cX,
          y: cY,
          background:
            "radial-gradient(50% 40% at 60% 40%, rgba(85,184,255,0.14) 0%, transparent 70%)",
        }}
      />

      {/* 3a — structure */}
      <div className="grid-hero mask-radial absolute inset-0 opacity-50" />

      {/* 3b — the lens.

             The window moves; its mask does not. That is the whole performance
             argument: a fixed `circle at 50% 50%` on a fixed-size element
             rasterises once, at mount. Animating `mask-image` position instead
             would re-raster a megapixel mask every frame — several milliseconds
             on a mid-range laptop, for one decorative layer. */}
      <motion.div
        className="absolute left-0 top-0 transition-opacity duration-500 will-change-transform"
        style={{
          x: lensX,
          y: lensY,
          width: LENS_SIZE,
          height: LENS_SIZE,
          // Centred on the cursor with margins, not a `-50%` translate: framer
          // owns `transform` on this node, and a second source of truth for it
          // is a bug waiting to happen.
          marginLeft: -LENS_HALF,
          marginTop: -LENS_HALF,
          maskImage: LENS_MASK,
          WebkitMaskImage: LENS_MASK,
          opacity: interactive ? 1 : 0,
        }}
      >
        {/* Oversized so the scaled, counter-translated grid always covers the
            window wherever the cursor is. It never rasterises at this size — a
            repeating background is one tile, tiled by the compositor. */}
        <div
          ref={lensRef}
          className="grid-hero absolute will-change-transform"
          style={{
            width: "200vw",
            height: "200vh",
            left: "-100vw",
            top: "-100vh",
            backgroundImage: LENS_GRID,
          }}
        />
      </motion.div>

      {/* 4 — the glow riding behind the cursor. `screen`, not `overlay`:
             overlay multiplies below 50% luminance, so on a near-black base it
             produces almost nothing. Kept below the grain so the grain's own
             blend still lands on top. */}
      <motion.div
        className="absolute left-0 top-0 mix-blend-screen transition-opacity duration-500 will-change-transform"
        style={{
          x: glowX,
          y: glowY,
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          marginLeft: -GLOW_SIZE / 2,
          marginTop: -GLOW_SIZE / 2,
          opacity: interactive ? 1 : 0,
          background:
            "radial-gradient(circle, rgba(85,184,255,0.13) 0%, rgba(36,107,253,0.07) 45%, transparent 70%)",
        }}
      />

      {/* 5 — horizon, low and wide */}
      <div className="absolute inset-x-0 bottom-0 h-[38%]">
        <div
          className="absolute inset-x-0 bottom-0 h-full"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(36,107,253,0.10) 60%, rgba(85,184,255,0.16) 100%)",
          }}
        />
        <div
          className="absolute inset-x-[8%] bottom-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(85,184,255,0.55) 30%, rgba(104,92,255,0.55) 70%, transparent)",
          }}
        />
      </div>

      {/* 6 — grain */}
      <div className="bg-grain absolute inset-0 opacity-[0.16] mix-blend-overlay" />

      {/* seam into the next chapter */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-void)]" />
    </div>
  );
}
