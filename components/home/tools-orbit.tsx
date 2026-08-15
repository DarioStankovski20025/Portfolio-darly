"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";

import type { StackGroup } from "@/components/ui/orbiting-circles-02";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TextReveal } from "@/components/ui/text-reveal";
import { stackGroups } from "@/lib/content";
import { cn } from "@/lib/utils";

// Canvas + orbit animation is below the fold and client-only — loaded on demand.
const OrbitingCirclesGlobe = dynamic(
  () => import("@/components/ui/orbiting-circles-02"),
  {
    ssr: false,
    loading: () => <div className="mx-auto aspect-square w-full max-w-[min(94vw,780px)]" aria-hidden />,
  },
);

/**
 * Our stack.
 *
 * Centred composition: the headline carries the section, the orbit sits
 * immediately beneath it, and the categories below double as a legend —
 * hovering one highlights the matching tools in the orbit.
 */
export function ToolsOrbit() {
  const [activeGroup, setActiveGroup] = useState<StackGroup | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // A soft light that follows the pointer across the grid — one composited
  // gradient, no glow blobs.
  const mx = useMotionValue(50);
  const my = useMotionValue(38);
  const sx = useSpring(mx, { stiffness: 55, damping: 20 });
  const sy = useSpring(my, { stiffness: 55, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(620px circle at ${sx}% ${sy}%, rgba(85,184,255,0.13), transparent 68%)`;

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (reduced || event.pointerType !== "mouse" || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      mx.set(((event.clientX - rect.left) / rect.width) * 100);
      my.set(((event.clientY - rect.top) / rect.height) * 100);
    },
    [mx, my, reduced],
  );

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      className="on-dark relative isolate overflow-hidden bg-stack pb-[clamp(2.5rem,4vw,4rem)] pt-[clamp(3rem,5vw,5.5rem)] text-paper"
    >
      {/* faint coordinate grid */}
      <div
        aria-hidden
        className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-50"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: spotlight }}
      />

      <div className="shell-tight relative text-center">
        <Reveal y={12} className="flex justify-center">
          <SectionLabel size="lg" className="mb-6">Our stack</SectionLabel>
        </Reveal>

        <TextReveal
          as="h2"
          className="t-display-lg mx-auto max-w-[16ch]"
          lineClassName="flex flex-wrap justify-center"
          lines={[
            [{ text: "Modern technology." }],
            [
              { text: "Chosen for the " },
              { text: "product", className: "editorial" },
              { text: ".", className: "dot-accent" },
            ],
          ]}
        />

        <Reveal delay={0.06}>
          <p className="t-body mx-auto mt-5 max-w-[760px]">
            From Webflow websites to custom AI platforms, we choose the stack around
            what the product needs today — and where it needs to go next.
          </p>
        </Reveal>
      </div>

      {/* ---------------- the orbit, close under the headline ---------------- */}
      <div className="relative mt-[clamp(0.25rem,0.6vw,0.5rem)]">
        <OrbitingCirclesGlobe activeGroup={activeGroup} />
      </div>

      {/* ---------------- categories double as the legend ---------------- */}
      <div className="shell relative mt-[clamp(0.5rem,1.2vw,1rem)]">
        <div
          className="grid grid-cols-2 gap-px overflow-hidden border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-3 lg:grid-cols-6"
          onMouseLeave={() => setActiveGroup(null)}
        >
          {stackGroups.map((group) => {
            const isActive = activeGroup === group.group;
            return (
              <button
                key={group.group}
                type="button"
                onMouseEnter={() => setActiveGroup(group.group as StackGroup)}
                onFocus={() => setActiveGroup(group.group as StackGroup)}
                onBlur={() => setActiveGroup(null)}
                onClick={() =>
                  setActiveGroup((current) =>
                    current === group.group ? null : (group.group as StackGroup),
                  )
                }
                aria-pressed={isActive}
                className={cn(
                  "flex flex-col gap-2.5 p-[clamp(0.9rem,1.4vw,1.25rem)] text-left transition-colors duration-300",
                  isActive ? "bg-device" : "bg-stack hover:bg-ink-2",
                )}
              >
                <span
                  className={cn(
                    "t-label-sm transition-colors duration-300",
                    isActive ? "text-[var(--accent-contextual)]" : "text-[var(--muted-fg)]",
                  )}
                >
                  {group.group}
                </span>
                <ul className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-[0.875rem] font-medium tracking-[-0.01em]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
