"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Bloom } from "@/components/ui/bloom";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import { buildEyebrow, buildLead, buildStages } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Watch an idea become a product.
 *
 * This replaced a full-screen canvas that morphed a mock interface through six
 * stages across four viewports of scroll. It looked expensive and it read as
 * work: you had to scroll through the whole thing to find out what the six
 * stages even were, and on a phone the mock was a five-pixel miniature.
 *
 * Six rows say the same thing in one screen. Everything is legible at rest —
 * number, stage, and one sentence — so the section is understood before any
 * interaction happens. The motion is then purely reward: a rule that wipes in
 * under the row, the numeral turning accent, and a small gradient plate that
 * follows the pointer and names the stage it is over. No sticky track, no
 * hijacked scroll, nothing to wait for.
 */

/**
 * One gradient per stage, walking the signature palette from cool to warm.
 *
 * They exist so the pointer plate is not the same object six times — the
 * gradient is the only thing that distinguishes a stage at a glance, so it has
 * to actually change.
 */
const PLATES = [
  "linear-gradient(135deg,#55b8ff,#246bfd)",
  "linear-gradient(135deg,#246bfd,#685cff)",
  "linear-gradient(135deg,#685cff,#a79dff)",
  "linear-gradient(135deg,#246bfd,#55b8ff)",
  "linear-gradient(135deg,#55b8ff,#5fe0b4)",
  "linear-gradient(135deg,#685cff,#55b8ff)",
];

export function BuildTransform() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();

  // Which row the pointer is over. This changes on row enter, not on move —
  // one render per row, never one per frame.
  const [active, setActive] = useState<number | null>(null);
  const [interactive, setInteractive] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const plateX = useSpring(x, { stiffness: 160, damping: 22, mass: 0.5 });
  const plateY = useSpring(y, { stiffness: 160, damping: 22, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const evaluate = () => setInteractive(fine.matches && !calm.matches);

    evaluate();
    fine.addEventListener("change", evaluate);
    calm.addEventListener("change", evaluate);
    return () => {
      fine.removeEventListener("change", evaluate);
      calm.removeEventListener("change", evaluate);
    };
  }, []);

  const onMove = (event: React.PointerEvent) => {
    if (!interactive || event.pointerType !== "mouse" || !listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <section className="section-y relative isolate overflow-x-clip bg-paper">
      <Bloom preset="dusk" />

      <div className="shell">
        {/* ---------------- opening ---------------- */}
        <div className="grid gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="t-label text-[var(--accent-contextual)]">{buildEyebrow}</span>
            </Reveal>

            <TextReveal
              as="h2"
              className="t-display mt-[clamp(1.25rem,2.2vw,1.75rem)]"
              hover
              lines={[
                [{ text: "Watch an idea" }],
                [
                  { text: "become a " },
                  { text: "product", className: "editorial text-[1.06em]" },
                  { text: ".", className: "dot-accent" },
                ],
              ]}
            />
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.08}>
              <p className="t-body max-w-[38ch]">{buildLead}</p>
            </Reveal>
          </div>
        </div>

        {/* ---------------- the six ---------------- */}
        <ol
          ref={listRef}
          onPointerMove={onMove}
          onPointerLeave={() => setActive(null)}
          className="relative mt-[clamp(2.5rem,5vw,4.5rem)] border-t border-[var(--hairline)]"
        >
          {buildStages.map((stage, index) => (
            <Row
              key={stage.key}
              index={index}
              stage={stage}
              active={active === index}
              dimmed={active !== null && active !== index}
              reduced={Boolean(reduced)}
              onEnter={() => interactive && setActive(index)}
            />
          ))}

          {/*
            The plate. One element, moved by springs, never re-rendered by the
            pointer — only its gradient and numeral change, and those change
            once per row rather than once per frame.
          */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-10 hidden overflow-hidden rounded-[10px] shadow-[0_24px_50px_-24px_rgba(7,17,31,0.45)] lg:block"
            style={{
              x: plateX,
              y: plateY,
              width: 132,
              height: 92,
              marginLeft: 28,
              marginTop: -46,
              background: PLATES[active ?? 0],
            }}
            initial={false}
            animate={{
              opacity: active === null ? 0 : 1,
              scale: active === null ? 0.85 : 1,
            }}
            transition={{ duration: 0.36, ease: EASE }}
          >
            <div className="flex size-full flex-col justify-between p-3.5">
              <span className="t-num text-[1.75rem] font-medium leading-none tracking-[-0.04em] text-white/95">
                {buildStages[active ?? 0].index}
              </span>
              <span className="t-label-sm text-white/80">
                {buildStages[active ?? 0].label}
              </span>
            </div>
          </motion.div>
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Row({
  index,
  stage,
  active,
  dimmed,
  reduced,
  onEnter,
}: {
  index: number;
  stage: (typeof buildStages)[number];
  active: boolean;
  dimmed: boolean;
  reduced: boolean;
  onEnter: () => void;
}) {
  return (
    <motion.li
      onPointerEnter={onEnter}
      className="group relative border-b border-[var(--hairline)]"
      initial={reduced ? undefined : { opacity: 0, y: 18 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: EASE }}
    >
      {/* The rule that wipes in under the row. Transform only — a border-color
          change cannot be given direction, and direction is the whole effect. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-[-1px] h-px origin-left bg-[image:var(--gradient-signature)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          active ? "scale-x-100" : "scale-x-0",
        )}
      />

      <div
        className={cn(
          "grid items-baseline gap-x-[clamp(1rem,2.5vw,3rem)] gap-y-2 py-[clamp(1.25rem,2.4vw,2rem)] transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          // 16rem, not 14: "Development" is the longest label and overruns a
          // 14rem track by a few pixels at the top of the type scale.
          "grid-cols-[auto_1fr] lg:grid-cols-[auto_minmax(0,16rem)_minmax(0,1fr)]",
          // Everything else recedes while one row is being read.
          dimmed ? "opacity-45" : "opacity-100",
        )}
      >
        <span
          className={cn(
            "t-num text-[0.8125rem] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            active
              ? "text-[var(--accent-contextual)]"
              : "text-[color-mix(in_oklab,var(--on-surface)_38%,transparent)]",
          )}
        >
          {stage.index}
        </span>

        <h3
          className={cn(
            "whitespace-nowrap text-[clamp(1.5rem,2.8vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.04em]",
            "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            active && "translate-x-[6px]",
          )}
        >
          {stage.label}
        </h3>

        <p className="t-body col-start-2 max-w-[52ch] text-[0.9375rem] lg:col-start-3">
          {stage.body}
        </p>
      </div>
    </motion.li>
  );
}
