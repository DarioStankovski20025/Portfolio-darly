"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { EASE } from "@/lib/motion";

type CursorState = "default" | "link" | "view" | "drag" | "start";

const LABELS: Partial<Record<CursorState, string>> = {
  view: "View ↗",
  drag: "Drag",
  start: "Start ↗",
};

/**
 * Desktop-only pointer.
 *
 * It samples the surface underneath it — walking up from `elementFromPoint` to
 * the first painted background — and flips between a light and dark cursor so
 * it stays visible on every chapter of the page, including sections that are
 * neither pure white nor pure black. Never rendered for touch input or for
 * reduced-motion visitors, and it never intercepts pointer events.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);
  const [onDark, setOnDark] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { stiffness: 1200, damping: 60, mass: 0.25 });
  const dotY = useSpring(y, { stiffness: 1200, damping: 60, mass: 0.25 });
  const discX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const discY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });

  const lastSample = useRef(0);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const evaluate = () => setEnabled(fine.matches && !calm.matches);

    evaluate();
    fine.addEventListener("change", evaluate);
    calm.addEventListener("change", evaluate);
    return () => {
      fine.removeEventListener("change", evaluate);
      calm.removeEventListener("change", evaluate);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.body.dataset.cursor = "on";

    /**
     * First painted background under the pointer decides the cursor colour —
     * but only from elements big enough to actually be a surface. Without the
     * size floor a 6px accent dot or a tag chip would flip the whole cursor,
     * while a genuinely dark panel (a project preview, a code overlay) still
     * counts and correctly lightens it.
     */
    const MIN_SURFACE_W = 120;
    const MIN_SURFACE_H = 72;

    const sampleSurface = (clientX: number, clientY: number) => {
      let node = document.elementFromPoint(clientX, clientY);
      while (node && node !== document.documentElement) {
        const rect = node.getBoundingClientRect();
        if (rect.width >= MIN_SURFACE_W && rect.height >= MIN_SURFACE_H) {
          const background = getComputedStyle(node).backgroundColor;
          const parts = background.match(/[\d.]+/g);
          if (parts && parts.length >= 3 && (parts.length < 4 || Number(parts[3]) > 0.5)) {
            const luminance =
              (0.2126 * Number(parts[0]) +
                0.7152 * Number(parts[1]) +
                0.0722 * Number(parts[2])) /
              255;
            setOnDark(luminance < 0.5);
            return;
          }
        }
        node = node.parentElement;
      }
      setOnDark(false);
    };

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      if (!visible) setVisible(true);

      // Sampling walks the DOM, so it runs a few times a second, not per frame.
      const now = event.timeStamp;
      if (now - lastSample.current > 110) {
        lastSample.current = now;
        sampleSurface(event.clientX, event.clientY);
      }
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const hit = target?.closest?.("[data-cursor]");
      const value = hit?.getAttribute("data-cursor") as CursorState | undefined;
      setState(value ?? "default");
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      delete document.body.dataset.cursor;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  const label = LABELS[state];
  const isDisc = Boolean(label);
  const ink = onDark ? "#f5f7fa" : "#07111f";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[150] hidden lg:block">
      {/* precise dot */}
      <motion.div
        className="absolute left-0 top-0 rounded-full"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isDisc ? 0 : 8,
          height: isDisc ? 0 : 8,
          opacity: visible && !isDisc ? 1 : 0,
          backgroundColor: ink,
        }}
        transition={{ duration: 0.25, ease: EASE }}
      />

      {/* ring over interactive elements */}
      <motion.div
        className="absolute left-0 top-0 rounded-full border"
        style={{ x: discX, y: discY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: state === "link" ? 44 : 20,
          height: state === "link" ? 44 : 20,
          opacity: visible && state === "link" ? 1 : 0,
          borderColor: ink,
        }}
        transition={{ duration: 0.3, ease: EASE }}
      />

      {/* labelled disc over media and actions */}
      <AnimatePresence>
        {isDisc && visible && (
          <motion.div
            className="absolute left-0 top-0 flex items-center justify-center rounded-full bg-accent"
            style={{ x: discX, y: discY, translateX: "-50%", translateY: "-50%" }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ width: 96, height: 96, opacity: 1 }}
            exit={{ width: 0, height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <span className="t-label-sm whitespace-nowrap text-white">{label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
