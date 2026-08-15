"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A single accent hairline down the right edge, tracking read progress.
 * Desktop only, non-interactive, and deliberately almost unnoticeable.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-0 top-0 z-[90] hidden h-svh w-[2px] lg:block"
    >
      <motion.div className="h-full w-full origin-top bg-accent" style={{ scaleY }} />
    </div>
  );
}
