"use client";

import Link from "next/link";

import { Bloom } from "@/components/ui/bloom";
import { ArrowGlyph, TextLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TextReveal } from "@/components/ui/text-reveal";
import { buildCategories } from "@/lib/content";

/**
 * What Darly sells, stated plainly.
 *
 * Five cards, one screen, no scroll choreography. This replaced a two-pane
 * version with a sticky panel and an animated schematic per category: it looked
 * busy, it doubled the section's height, and a visitor had to hover through
 * five diagrams to learn five things they could have read at once.
 *
 * Everything here is legible on arrival — name, one sentence, the tags. The
 * only interaction is the card lifting under the pointer, and every card goes
 * to `/services` for the detail rather than trying to hold it inline.
 */
export function WhatWeBuild() {
  return (
    <section
      id="services"
      className="on-dark section-y relative isolate overflow-x-clip bg-ink text-paper"
    >
      <Bloom preset="dawn" />

      <div className="shell">
        <div className="grid gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel className="mb-6">What we build</SectionLabel>
            <TextReveal
              as="h2"
              className="t-h2"
              lines={[
                [{ text: "Five things we build" }],
                [
                  { text: "properly", className: "editorial" },
                  { text: ".", className: "dot-accent" },
                ],
              ]}
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.06}>
              <p className="t-body max-w-[44ch]">
                When an off-the-shelf tool isn&apos;t enough, we design the
                experience and engineer the system around your business.
              </p>
            </Reveal>
          </div>
        </div>

        {/*
          A hairline grid: one border on the wrapper, `gap-px` over a hairline
          background, and each cell paints its own surface. Cheaper than a
          border per card and it never doubles up on the seams.

          Three columns, five cards — the last two take half the row each, so
          the grid closes flush instead of leaving a gap.
        */}
        <div className="mt-[clamp(2.5rem,4vw,3.5rem)] grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-6">
          {buildCategories.map((category, index) => (
            <Reveal
              key={category.index}
              y={16}
              delay={index * 0.05}
              amount={0.2}
              className={index < 3 ? "lg:col-span-2" : "lg:col-span-3"}
            >
              <Link
                href="/services"
                data-cursor="link"
                className="group relative flex h-full flex-col gap-3.5 bg-ink p-[clamp(1.25rem,2vw,1.85rem)] transition-colors duration-300 hover:bg-ink-2"
              >
                {/* the gradient edge only exists on hover */}
                <span
                  aria-hidden
                  className="rule-gradient absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />

                <div className="flex items-center justify-between gap-4">
                  <span className="t-label text-[var(--accent-contextual)]">
                    {category.index}
                  </span>
                  <ArrowGlyph className="size-5 text-[var(--muted-fg)] transition-colors duration-300 group-hover:text-[var(--accent-contextual)]" />
                </div>

                <h3 className="text-[clamp(1.25rem,1.9vw,1.625rem)] font-medium leading-[1.1] tracking-[-0.03em]">
                  {category.title}
                </h3>

                <p className="t-body max-w-[42ch] text-[0.9375rem]">
                  {category.summary}
                </p>

                <ul className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                  {category.tags.map((tag) => (
                    <li key={tag} className="tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-[clamp(1.75rem,2.5vw,2.25rem)]" delay={0.05}>
          <TextLink href="/services">See all services in detail</TextLink>
        </Reveal>
      </div>
    </section>
  );
}
