"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { heroLimits, heroScale } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Limits → Scale.
 *
 * One motion value drives the whole thing: at 0 a rigid four-cell grid of
 * template/no-code constraints; at 1 that box has opened into a connected
 * system — custom UX, AI, API, data, automation, scale — wired to a single
 * core. Move the pointer horizontally across the hero and the system builds.
 *
 * It is the headline argument made visual: the same product, past its limits,
 * without starting again. Everything is transform and opacity on motion values,
 * so dragging the pointer across it costs no React renders.
 */

/** Rigid 2×2 cage — the constrained state. */
const LIMIT_POSITIONS = [
  { x: 32, y: 33 },
  { x: 68, y: 33 },
  { x: 32, y: 67 },
  { x: 68, y: 67 },
];

/** Open constellation — the scaled state. */
const SCALE_POSITIONS = [
  { x: 18, y: 20 },
  { x: 52, y: 10 },
  { x: 86, y: 26 },
  { x: 14, y: 62 },
  { x: 48, y: 86 },
  { x: 88, y: 68 },
];

const HUB = { x: 51, y: 48 };

export function LimitsToScale({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [scaled, setScaled] = useState(false);

  const raw = useMotionValue(0);
  const t = useSpring(raw, { stiffness: 90, damping: 22, mass: 0.5 });
  const railKnob = useTransform(t, (v) => `calc(${v * 100}% - 4px)`);

  useMotionValueEvent(t, "change", (value) => {
    setScaled((current) => {
      const next = value > 0.5;
      return current === next ? current : next;
    });
  });

  useEffect(() => {
    if (reduced) {
      raw.set(1);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;

    // Touch has no hover, so the system builds and settles on its own.
    if (coarse) {
      const controls = animate(raw, [0, 1, 0.35, 1], {
        duration: 9,
        times: [0, 0.42, 0.62, 1],
        ease: EASE,
        repeat: Infinity,
        repeatType: "reverse",
      });
      return () => controls.stop();
    }

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      // Track across the whole hero, not just the graphic.
      const hero = element.closest("section")?.getBoundingClientRect() ?? rect;
      raw.set(Math.min(1, Math.max(0, (event.clientX - hero.left) / hero.width)));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [raw, reduced]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full select-none", className)}
      aria-hidden
    >
      <div className="relative aspect-[10/9] w-full">
        {/* the cage: rigid at rest, opened and faded once the system forms */}
        <Cage t={t} />

        {/* connections from the core outward */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          {SCALE_POSITIONS.map((position, index) => (
            <Connection key={index} t={t} to={position} index={index} />
          ))}
        </svg>

        {/* the core */}
        <Core t={t} />

        {/* constrained state */}
        {heroLimits.map((label, index) => (
          <LimitChip key={label} t={t} label={label} index={index} />
        ))}

        {/* scaled state */}
        {heroScale.map((label, index) => (
          <ScaleNode key={label} t={t} label={label} index={index} />
        ))}
      </div>

      {/* the rail: where you are between the two states */}
      <div className="mt-5 flex items-center gap-4">
        <span
          className={cn(
            "t-label-sm shrink-0 transition-colors duration-300",
            scaled ? "text-[var(--muted-fg)]" : "text-[var(--on-surface)]",
          )}
        >
          Limits
        </span>
        <div className="relative h-px flex-1 bg-[var(--hairline)]">
          <motion.div
            className="absolute inset-y-0 left-0 bg-[var(--accent-contextual)]"
            style={{ scaleX: t, originX: 0, width: "100%" }}
          />
          <motion.span
            className="absolute top-1/2 block size-2 -translate-y-1/2 rounded-full bg-[var(--accent-contextual)]"
            style={{ left: railKnob }}
          />
        </div>
        <span
          className={cn(
            "t-label-sm shrink-0 transition-colors duration-300",
            scaled ? "text-[var(--accent-contextual)]" : "text-[var(--muted-fg)]",
          )}
        >
          Scale
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Cage({ t }: { t: MotionValue<number> }) {
  const scale = useTransform(t, [0, 1], [1, 1.55]);
  const opacity = useTransform(t, [0, 0.55], [1, 0]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 size-[52%] -translate-x-1/2 -translate-y-1/2 border border-[var(--hairline-strong)]"
      style={{ scale, opacity }}
    >
      {/* the grid that boxes everything in */}
      <span className="absolute left-1/2 top-0 h-full w-px bg-[var(--hairline)]" />
      <span className="absolute left-0 top-1/2 h-px w-full bg-[var(--hairline)]" />
      {[
        "-left-[3px] -top-[3px]",
        "-right-[3px] -top-[3px]",
        "-bottom-[3px] -left-[3px]",
        "-bottom-[3px] -right-[3px]",
      ].map((corner) => (
        <span
          key={corner}
          className={cn(
            "absolute size-1.5 border border-[var(--hairline-strong)] bg-[var(--surface)]",
            corner,
          )}
        />
      ))}
    </motion.div>
  );
}

function Core({ t }: { t: MotionValue<number> }) {
  const opacity = useTransform(t, [0.18, 0.5], [0, 1]);
  const scale = useTransform(t, [0.18, 0.6], [0.5, 1]);

  return (
    <motion.div
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${HUB.x}%`, top: `${HUB.y}%`, opacity, scale }}
    >
      {/*
        Inverted rather than accented: the hub is the wordmark, and inverting
        the contextual pair keeps it legible on either chapter — neither accent
        clears 4.5:1 against both paper and ink.
      */}
      <span className="flex items-baseline rounded-[3px] bg-[var(--on-surface)] px-3 py-2 text-[0.8125rem] font-medium leading-none tracking-[-0.02em] text-[var(--surface)] shadow-[0_8px_24px_-12px_rgba(7,11,15,0.9)]">
        darly
        <span className="ml-px text-[var(--accent-contextual)]">.</span>
      </span>
    </motion.div>
  );
}

function Connection({
  t,
  to,
  index,
}: {
  t: MotionValue<number>;
  to: { x: number; y: number };
  index: number;
}) {
  const start = 0.34 + index * 0.045;
  const pathLength = useTransform(t, [start, start + 0.3], [0, 1]);
  const opacity = useTransform(t, [start, start + 0.12], [0, 1]);

  return (
    <motion.line
      x1={HUB.x}
      y1={HUB.y}
      x2={to.x}
      y2={to.y}
      stroke="var(--accent-contextual)"
      strokeWidth={0.25}
      vectorEffect="non-scaling-stroke"
      style={{ pathLength, opacity }}
    />
  );
}

function LimitChip({
  t,
  label,
  index,
}: {
  t: MotionValue<number>;
  label: string;
  index: number;
}) {
  const position = LIMIT_POSITIONS[index];
  const fade = 0.12 + index * 0.05;

  const opacity = useTransform(t, [fade, fade + 0.3], [1, 0]);
  // They drift outward in pixels as the cage opens, then vanish.
  const x = useTransform(t, [0, 1], [0, (position.x - 50) * 0.9]);
  const y = useTransform(t, [0, 1], [0, (position.y - 50) * 0.9]);

  return (
    <motion.span
      className="absolute z-10 whitespace-nowrap border border-[var(--hairline-strong)] bg-[var(--surface)] px-2.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-[var(--muted-fg)]"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        translateX: "-50%",
        translateY: "-50%",
        opacity,
        x,
        y,
      }}
    >
      {label}
    </motion.span>
  );
}

function ScaleNode({
  t,
  label,
  index,
}: {
  t: MotionValue<number>;
  label: string;
  index: number;
}) {
  const position = SCALE_POSITIONS[index];
  const start = 0.38 + index * 0.05;

  const opacity = useTransform(t, [start, start + 0.2], [0, 1]);
  const scale = useTransform(t, [start, start + 0.25], [0.7, 1]);
  // Nodes travel out from the core, in pixels, as they appear.
  const x = useTransform(t, [start, start + 0.35], [(HUB.x - position.x) * 0.9, 0]);
  const y = useTransform(t, [start, start + 0.35], [(HUB.y - position.y) * 0.9, 0]);

  return (
    <motion.span
      className="absolute z-20 flex items-center gap-2 whitespace-nowrap rounded-[3px] border border-[var(--hairline-strong)] bg-[var(--surface)] px-2.5 py-1.5 text-[0.75rem] font-medium tracking-[-0.01em] shadow-[0_10px_30px_-22px_rgba(7,11,15,0.6)]"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        translateX: "-50%",
        translateY: "-50%",
        opacity,
        scale,
        x,
        y,
      }}
    >
      <span className="block size-1.5 shrink-0 rounded-full bg-[var(--accent-contextual)]" />
      {label}
    </motion.span>
  );
}
