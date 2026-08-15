"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TextReveal } from "@/components/ui/text-reveal";
import { pipelineSteps } from "@/lib/services";

/**
 * How the work runs.
 *
 * Was a thin strip of four words joined by dashes, which said nothing. Now the
 * connecting line draws itself as the section scrolls: one spring bound to
 * scroll progress, scaled along the track. It runs horizontally on desktop and
 * vertically below `lg`, which is the axis the steps stack on anyway.
 */
export function PipelineTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <section className="section-y bg-paper">
      <div className="shell">
        <div className="grid gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel size="lg" className="mb-6">
              How the work runs
            </SectionLabel>
            <TextReveal
              as="h2"
              className="t-h2"
              lines={[
                [{ text: "Four stages," }],
                [
                  { text: "one " },
                  { text: "team", className: "editorial" },
                  { text: ".", className: "dot-accent" },
                ],
              ]}
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.06}>
              <p className="t-body max-w-[40ch]">
                The same people carry the work from the first conversation to the
                thing running in production.
              </p>
            </Reveal>
          </div>
        </div>

        <div ref={ref} className="relative mt-[clamp(2.5rem,4vw,3.5rem)]">
          {/* the track */}
          <div
            aria-hidden
            className="absolute left-[7px] top-0 h-full w-px bg-[var(--hairline)] lg:left-0 lg:top-[7px] lg:h-px lg:w-full"
          >
            <motion.div
              className="rule-gradient h-full w-full origin-top lg:origin-left"
              style={
                reduced
                  ? { scaleY: 1, scaleX: 1 }
                  : { scaleY: progress, scaleX: progress }
              }
            />
          </div>

          <ol className="grid gap-y-8 lg:grid-cols-4 lg:gap-x-[clamp(1.5rem,3vw,3rem)] lg:gap-y-0">
            {pipelineSteps.map((step, index) => (
              <Reveal
                key={step.stage}
                y={16}
                delay={index * 0.06}
                className="relative pl-8 lg:pl-0 lg:pt-8"
              >
                {/* the node sits on the track */}
                <span
                  aria-hidden
                  className="absolute left-[3px] top-[0.45em] block size-[9px] rounded-full border-2 border-[var(--surface)] bg-accent lg:left-0 lg:top-[3px]"
                />

                <div className="flex items-baseline gap-3">
                  <span className="t-label-sm text-[var(--accent-contextual)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[clamp(1.125rem,1.6vw,1.375rem)] font-medium tracking-[-0.025em]">
                    {step.stage}
                  </h3>
                </div>
                <p className="t-body mt-3 max-w-[34ch] text-[0.9375rem]">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
