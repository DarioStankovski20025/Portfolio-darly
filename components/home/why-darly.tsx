"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { useRef, useState } from "react";

import { Bloom } from "@/components/ui/bloom";
import { SectionLabel } from "@/components/ui/section-label";
import { TextReveal } from "@/components/ui/text-reveal";
import { reasons, type Reason } from "@/lib/content";
import { DUR, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Why Darly.
 *
 * One reason is dominant at a time, and the active one is *derived from scroll
 * progress* — never incremented from wheel events. Each reason owns a quarter of
 * the track (220vh total, so ~30vh of scrolling each), which means a normal
 * wheel motion advances part of one stage rather than skipping three.
 *
 * Mobile drops the sticky track entirely and reads as a vertical sequence.
 */
export function WhyDarly() {
  return (
    <section className="on-dark relative isolate overflow-x-clip bg-ink text-paper">
      <Bloom preset="dusk" />
      <DesktopWhy />
      <MobileWhy />
    </section>
  );
}

/* ---------------- desktop ---------------- */

function DesktopWhy() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Active index comes from normalised progress, so scroll distance and stage
  // changes stay proportional.
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(
      reasons.length - 1,
      Math.max(0, Math.floor(value * reasons.length)),
    );
    setActive((current) => (current === next ? current : next));
  });

  const railScale = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.001,
  });
  const reason = reasons[active];

  return (
    <div ref={trackRef} className="relative hidden h-[220vh] lg:block">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="shell w-full">
          <div className="grid gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-12">
            {/* sticky argument */}
            <div className="lg:col-span-5">
              <SectionLabel size="lg" className="mb-6">Why Darly</SectionLabel>
              <TextReveal
                as="h2"
                className="t-h2"
                lines={[
                  [{ text: "Built differently" }],
                  [
                    { text: "from a " },
                    { text: "typical agency", className: "editorial" },
                    { text: ".", className: "dot-accent" },
                  ],
                ]}
              />

              {/* progress across the four reasons */}
              <div className="mt-10 flex items-center gap-4">
                <span className="t-num text-[2.25rem] font-medium leading-none tracking-[-0.04em] text-[var(--accent-contextual)]">
                  {reason.index}
                </span>
                <div className="relative h-px flex-1 bg-[var(--hairline)]">
                  <motion.div
                    className="absolute inset-y-0 left-0 w-full origin-left bg-accent"
                    style={{ scaleX: railScale }}
                  />
                </div>
                <span className="t-label text-[var(--muted-fg)]">
                  {String(reasons.length).padStart(2, "0")}
                </span>
              </div>

              <ol className="mt-6 flex flex-col gap-2">
                {reasons.map((item, index) => (
                  <li
                    key={item.index}
                    className={cn(
                      "t-label-sm transition-colors duration-300",
                      index === active
                        ? "text-[var(--on-surface)]"
                        : "text-[var(--muted-fg)]/60",
                    )}
                  >
                    {item.index} — {item.title.replace(/\.$/, "")}
                  </li>
                ))}
              </ol>
            </div>

            {/* the dominant reason */}
            <div className="relative lg:col-span-6 lg:col-start-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={reason.index}
                  className="relative"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: DUR.base, ease: EASE }}
                >
                  {/* the index, oversized, holding the column together */}
                  <span
                    aria-hidden
                    className="t-num pointer-events-none absolute -top-[0.42em] right-0 select-none text-[clamp(7rem,13vw,14rem)] font-medium leading-none tracking-[-0.06em] text-[color-mix(in_oklab,#246bfd_9%,transparent)]"
                  >
                    {reason.index}
                  </span>

                  <h3 className="relative text-[clamp(1.875rem,3.4vw,3.25rem)] font-medium leading-[1.06] tracking-[-0.035em]">
                    {reason.title}
                  </h3>
                  <p className="t-lead relative mt-6 max-w-[46ch]">{reason.body}</p>
                  <ReasonDiagram reason={reason} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- the per-reason diagram ---------------- */

function ReasonDiagram({ reason }: { reason: Reason }) {
  const { from, via, to, shape } = reason.diagram;

  if (shape === "merge") {
    // Two inputs converging on one outcome.
    return (
      <div className="relative mt-12 flex items-center gap-5 border-t border-[var(--hairline)] pt-8">
        <div className="flex flex-col gap-3">
          <Chip delay={0.05}>{from}</Chip>
          <Chip delay={0.1}>{to}</Chip>
        </div>

        <motion.svg
          width="54"
          height="72"
          viewBox="0 0 54 72"
          fill="none"
          aria-hidden
          className="shrink-0"
        >
          {[
            "M2 16 H30 Q40 16 40 36",
            "M2 56 H30 Q40 56 40 36",
            "M40 36 H52",
          ].map((d, i) => (
            <motion.path
              key={d}
              d={d}
              stroke="var(--color-accent)"
              strokeWidth={1.25}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: EASE }}
            />
          ))}
        </motion.svg>

        <Chip delay={0.45} accent>
          {via}
        </Chip>
      </div>
    );
  }

  // A → B → C
  return (
    <div className="relative mt-12 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-[var(--hairline)] pt-8">
      <Chip delay={0.05}>{from}</Chip>
      <Arrow delay={0.15} />
      <Chip delay={0.25} accent>
        {via}
      </Chip>
      <Arrow delay={0.35} />
      <Chip delay={0.45}>{to}</Chip>
    </div>
  );
}

function Chip({
  children,
  delay,
  accent,
}: {
  children: React.ReactNode;
  delay: number;
  accent?: boolean;
}) {
  return (
    <motion.span
      className={cn(
        "t-label-sm inline-flex w-fit items-center whitespace-nowrap rounded-[3px] border px-3 py-2.5",
        accent
          ? "border-accent bg-accent text-white"
          : "border-[var(--hairline-strong)] text-[var(--muted-fg)]",
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.base, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  );
}

function Arrow({ delay }: { delay: number }) {
  return (
    <motion.span
      aria-hidden
      className="block h-px w-8 origin-left bg-accent"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay, ease: EASE }}
    />
  );
}

/* ---------------- mobile ---------------- */

function MobileWhy() {
  return (
    <div className="section-y shell lg:hidden">
      <SectionLabel size="lg" className="mb-5">Why Darly</SectionLabel>
      <TextReveal
        as="h2"
        className="t-h2"
        lines={[
          [{ text: "Built differently" }],
          [
            { text: "from a " },
            { text: "typical agency", className: "editorial" },
            { text: ".", className: "dot-accent" },
          ],
        ]}
      />

      <div className="mt-9">
        {reasons.map((reason, index) => (
          <motion.div
            key={reason.index}
            className="border-t border-[var(--hairline)] py-8 last:border-b"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: DUR.base, delay: index * 0.04, ease: EASE }}
          >
            <span className="t-label text-[var(--accent-contextual)]">{reason.index}</span>
            <h3 className="mt-3 text-[1.375rem] font-medium leading-[1.15] tracking-[-0.03em]">
              {reason.title}
            </h3>
            <p className="t-body mt-3">{reason.body}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-2">
              <span className="t-label-sm text-[var(--muted-fg)]">
                {reason.diagram.from}
              </span>
              <span aria-hidden className="text-[var(--accent-contextual)]">
                →
              </span>
              <span className="t-label-sm font-medium text-[var(--accent-contextual)]">
                {reason.diagram.via}
              </span>
              <span aria-hidden className="text-[var(--accent-contextual)]">
                →
              </span>
              <span className="t-label-sm text-[var(--muted-fg)]">
                {reason.diagram.to}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
