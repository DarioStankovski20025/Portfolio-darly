"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { DUR, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The recurring section marker: the Darly period, then a mono label.
 * `lg` is for sections that open on the label rather than on a headline,
 * where the standard 11px reads as an afterthought.
 */
export function SectionLabel({
  children,
  className,
  size = "sm",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "lg";
}) {
  const reduced = useReducedMotion();
  const large = size === "lg";

  return (
    <motion.div
      className={cn(
        "inline-flex items-center",
        large
          ? "gap-3.5 font-mono text-[clamp(0.9375rem,1.15vw,1.1875rem)] font-medium uppercase leading-none tracking-[0.2em]"
          : "t-label gap-2.5",
        className,
      )}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: DUR.base, ease: EASE }}
    >
      <motion.span
        aria-hidden
        className={cn(
          "block shrink-0 rounded-full bg-[var(--accent-contextual)]",
          large ? "size-2.5" : "size-[6px]",
        )}
        animate={reduced ? undefined : { scale: [1, 0.55, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <span>{children}</span>
    </motion.div>
  );
}
