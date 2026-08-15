"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { InteractiveGrid } from "@/components/ui/interactive-grid";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TextReveal } from "@/components/ui/text-reveal";
import { site } from "@/lib/content";

/**
 * Final CTA — compact, around two thirds of a viewport.
 *
 * The grid bends toward the pointer, a halo breathes behind the target, and the
 * call to action is a rotating badge that speeds up and opens out as you reach
 * for it. Everything is transform and opacity.
 */
export function FinalCta() {
  const [hot, setHot] = useState(false);
  const reduced = useReducedMotion();

  return (
    <section
      id="contact"
      className="on-dark relative isolate flex min-h-[60svh] items-center overflow-hidden bg-void py-[clamp(3.5rem,6vw,5.5rem)] text-paper lg:min-h-[70svh]"
    >
      <div className="absolute inset-0 -z-10">
        <InteractiveGrid
          mode="attract"
          spacing={40}
          radius={280}
          strength={16}
          baseColor="245, 247, 250"
          accentColor="36, 107, 253"
          ambient={1.4}
          link
        />
      </div>

      <div className="shell relative w-full">
        <div className="grid gap-[clamp(2.5rem,4vw,3rem)] lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <SectionLabel className="mb-6">Next step</SectionLabel>

            <TextReveal
              as="h2"
              className="t-display"
              lines={[
                [{ text: "Your next product" }],
                [{ text: "shouldn't be limited" }],
                [
                  { text: "by your " },
                  { text: "current tools", className: "editorial text-[var(--accent-contextual)]" },
                  { text: ".", className: "dot-accent" },
                ],
              ]}
            />

            <Reveal delay={0.08}>
              <p className="t-lead mt-6 max-w-[42ch]">
                Let&apos;s design and build what comes next.
              </p>

              <a
                href={`mailto:${site.email}`}
                data-cursor="link"
                className="group relative mt-7 inline-block text-[clamp(1rem,1.3vw,1.1875rem)] font-medium tracking-[-0.01em]"
              >
                {site.email}
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--accent-contextual)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </a>
            </Reveal>
          </div>

          {/* ---------------- the rotating target ---------------- */}
          <div className="lg:col-span-4 lg:col-start-9 lg:justify-self-end">
            <div className="relative">
              {/* halo, breathing behind the badge */}
              {!reduced && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px]"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(104,92,255,0.4) 0%, rgba(104,92,255,0) 70%)",
                  }}
                  animate={{ scale: [1, 1.14, 1], opacity: [0.55, 0.85, 0.55] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              <Magnetic strength={0.4}>
                <Link
                  href="/contact"
                  data-cursor="start"
                  aria-label="Start a project"
                  onMouseEnter={() => setHot(true)}
                  onMouseLeave={() => setHot(false)}
                  onFocus={() => setHot(true)}
                  onBlur={() => setHot(false)}
                  className="group relative flex size-[clamp(168px,17vw,216px)] items-center justify-center"
                >
                  {/* the word ring */}
                  <motion.svg
                    viewBox="0 0 200 200"
                    aria-hidden
                    className="absolute inset-0 size-full"
                    animate={reduced ? undefined : { rotate: 360 }}
                    transition={{
                      duration: hot ? 9 : 26,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <defs>
                      <path
                        id="cta-ring"
                        d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
                        fill="none"
                      />
                    </defs>
                    <text
                      className="fill-paper font-mono text-[13px] uppercase"
                      style={{ letterSpacing: "0.24em" }}
                    >
                      <textPath href="#cta-ring" startOffset="0">
                        Start a project · Start a project ·
                      </textPath>
                    </text>
                  </motion.svg>

                  {/* the disc */}
                  <span className="relative flex size-[54%] items-center justify-center rounded-full bg-paper text-ink transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <ArrowUpRight
                      className="size-7 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45"
                      strokeWidth={1.5}
                    />
                  </span>

                  {/* a ring that opens as the pointer arrives */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-[var(--hairline)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-inset-3 group-hover:border-[color-mix(in_oklab,var(--accent-contextual)_50%,transparent)]"
                  />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
