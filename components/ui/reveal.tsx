"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

import { DUR, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  /** Optional — Reveal is also used for bare shapes such as rules and blocks. */
  children?: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
  once?: boolean;
} & Omit<HTMLMotionProps<"div">, "children">;

/** Standard scroll entrance: a short lift, fast enough to never gate reading. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  amount = 0.25,
  once = true,
  ...rest
}: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration: reduced ? 0.2 : DUR.base,
        delay: reduced ? 0 : delay,
        ease: EASE,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** A hairline that draws itself across as it enters view. */
export function LineReveal({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn("h-px w-full origin-left bg-[var(--hairline)]", className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: DUR.slow, delay, ease: EASE }}
    />
  );
}
