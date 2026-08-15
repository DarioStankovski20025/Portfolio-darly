"use client";

import { motion } from "framer-motion";
import { Fragment } from "react";

import { VelocityMarquee } from "@/components/ui/velocity-marquee";
import { capabilities, pipeline } from "@/lib/content";
import { DUR, EASE } from "@/lib/motion";

/**
 * Fast proof directly under the hero: what we do, then how the work runs.
 * Compact by design — it is a connective band, not a section.
 */
export function CapabilityBar() {
  return (
    <section
      aria-label="Capabilities"
      className="relative border-y border-[var(--hairline)] bg-paper-2 py-[clamp(1.5rem,2.6vw,2.25rem)]"
    >
      <VelocityMarquee speed={3.2}>
        {capabilities.map((item) => (
          <Fragment key={item}>
            <span className="whitespace-nowrap px-[clamp(0.9rem,1.8vw,1.75rem)] text-[clamp(1.125rem,2.2vw,1.875rem)] font-medium uppercase leading-none tracking-[-0.02em]">
              {item}
            </span>
            <span aria-hidden className="block size-[5px] shrink-0 rounded-full bg-[var(--accent-contextual)]" />
          </Fragment>
        ))}
      </VelocityMarquee>

      <div className="shell mt-[clamp(1.25rem,2vw,1.75rem)] border-t border-[var(--hairline)] pt-[clamp(1rem,1.6vw,1.5rem)]">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {pipeline.map((stage, index) => (
            <motion.li
              key={stage}
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: DUR.base, delay: index * 0.06, ease: EASE }}
            >
              <span className="t-label text-[var(--muted-fg)]">{stage}</span>
              {index < pipeline.length - 1 && (
                <span aria-hidden className="text-[var(--accent-contextual)]">
                  →
                </span>
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
