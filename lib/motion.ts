import type { Transition, Variants } from "framer-motion";

/**
 * The single easing curve the whole site moves on.
 * Everything decelerates the same way, which is most of why it feels coherent.
 */
export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Timing scale. Reveals stay in the 0.45–0.75s band so text is readable almost
 * immediately — nothing on this page makes a visitor wait to read it.
 */
export const DUR = {
  fast: 0.28,
  base: 0.5,
  slow: 0.7,
} as const;

export const STAGGER = {
  tight: 0.04,
  base: 0.06,
  loose: 0.09,
} as const;

export const transition = (duration = DUR.base, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE,
});

/** Default viewport config for scroll-triggered entrances. */
export const inView = { once: true, amount: 0.3 } as const;
export const inViewSoft = { once: true, amount: 0.12 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: transition(DUR.base, i * STAGGER.base),
  }),
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: (i: number = 0) => ({
    opacity: 1,
    transition: transition(DUR.base, i * STAGGER.base),
  }),
};

/** Parent wrapper for staggered children. */
export const stagger = (
  staggerChildren = STAGGER.base,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});
