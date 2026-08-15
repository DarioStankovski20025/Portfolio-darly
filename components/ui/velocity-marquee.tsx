"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Keeps a value inside [min, max) — the seam that makes the loop invisible. */
function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

type VelocityMarqueeProps = {
  children: ReactNode;
  /** Percent of the track travelled per second. */
  speed?: number;
  direction?: 1 | -1;
  className?: string;
  fade?: boolean;
};

/**
 * Marquee that leans into the scroll.
 *
 * Base drift is constant, but scroll velocity is added on top, so the strip
 * surges as the visitor moves down the page and settles when they stop — the
 * page feels connected to the input rather than merely decorated. One motion
 * value, transform only, and it stops dead when offscreen or when the visitor
 * prefers reduced motion.
 */
export function VelocityMarquee({
  children,
  speed = 4,
  direction = -1,
  className,
  fade = true,
}: VelocityMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0 });
  const reduced = useReducedMotion();

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 48,
    stiffness: 340,
  });
  const velocityFactor = useTransform(smoothVelocity, [-2200, 2200], [-3.2, 3.2], {
    clamp: false,
  });

  useAnimationFrame((_, delta) => {
    if (reduced || !inView) return;
    const seconds = Math.min(delta, 64) / 1000;
    let move = direction * speed * seconds;
    move += move * Math.abs(velocityFactor.get());
    // The track holds two copies, so -50% is exactly one seam.
    baseX.set(wrap(-50, 0, baseX.get() + move));
  });

  const x = useTransform(baseX, (value) => `${value}%`);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", fade && "mask-fade-r", className)}
    >
      <motion.div className="flex w-max" style={{ x }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
