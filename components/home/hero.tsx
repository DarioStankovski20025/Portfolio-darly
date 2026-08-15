"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { HeroBackdrop } from "@/components/home/hero-backdrop";
import { useIntro } from "@/components/providers/intro";
import { CtaButton } from "@/components/ui/button";
import { HOVER_GRADIENT, TextReveal } from "@/components/ui/text-reveal";
import {
  heroAvailability,
  heroBuilds,
  heroFounderNote,
  heroHeadingSr,
  heroLead,
  heroTrustedLead,
  projects,
} from "@/lib/content";
import { DUR, EASE } from "@/lib/motion";

/**
 * Centred, and slower than it was.
 *
 * 2200ms was fine when the cycler sat in a left column against a product shot.
 * Centred it lands on the page's axis of symmetry, where the same interval
 * reads as agitated rather than alive.
 */
const CYCLE_MS = 2800;

/**
 * Hero.
 *
 * Type over a cursor-reactive backdrop, centred, with nothing competing for the
 * same attention. The previous version put a laptop screenshot in a right-hand
 * column — a 1.5MB priority PNG that was both the LCP element and the weakest
 * argument on the page. The work speaks for itself two sections down; here the
 * job is the offer, the proof that someone real is on the other end, and a
 * background worth staying on.
 */
export function Hero() {
  const { ready } = useIntro();
  const reduced = useReducedMotion();

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 16 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : 16 },
    transition: { duration: DUR.slow, delay, ease: EASE },
  });

  return (
    <section
      /*
        `min-h-svh` on mobile, not `dvh`: `dvh` reflows when the mobile browser
        chrome collapses on scroll, which is a layout shift on the first thing
        anyone sees. With the image gone the mobile hero is short enough to look
        stubby without a floor.

        `88svh` on desktop rather than the old `94svh` — the content is now
        taller than either floor at 768px, so the floor only matters on a tall
        monitor, where 94svh opened a void above and below the centred column.
      */
      className="on-dark relative isolate flex min-h-svh flex-col justify-center overflow-hidden bg-void pb-[clamp(2rem,4vw,3rem)] pt-[128px] text-paper lg:min-h-[88svh] lg:pt-[clamp(6rem,7vw,8rem)]"
    >
      <HeroBackdrop />

      {/*
        `.shell-tight` (1320px), not `.shell` (1600px). A centred column in a
        1600px shell has nothing setting its measure — the headline would run to
        ~1470px on a wide monitor, and `text-wrap: balance` cannot rescue it
        because the line breaks are forced by the `lines` array.
      */}
      <div className="shell-tight flex w-full flex-col items-center text-center">
        <motion.div {...enter(0.02)}>
          {/* Type alone. A capsule with a border and a pulsing dot is the
              standard SaaS availability badge, and reading as standard is the
              one thing this line cannot afford. */}
          <span className="t-label-sm text-[var(--muted-fg)]">
            {heroAvailability.status} — {heroAvailability.window}
          </span>
        </motion.div>

        <h1 className="sr-only">{heroHeadingSr}</h1>

        <div aria-hidden className="mt-[clamp(1rem,1.6vw,1.4rem)]">
          <TextReveal
            as="div"
            className="t-hero"
            immediate
            play={ready}
            delay={0.05}
            stagger={0.03}
            blur={7}
            hover
            lines={[
              [{ text: "Your next platform," }],
              [
                {
                  // Instrument Serif 400 next to Geist 500 at 86px reads lighter
                  // and smaller — the serif has a shorter x-height — so it takes
                  // a 5% optical bump to sit at the same weight as its neighbour.
                  //
                  // The gradient rides on `HOVER_GRADIENT`, not here: it has to
                  // sit on the same element as the hover filter or the word
                  // disappears the moment the pointer touches it.
                  text: "engineered",
                  className: "editorial text-[1.05em]",
                  hoverClassName: HOVER_GRADIENT,
                },
                { text: " end to end" },
                { text: ".", className: "dot-accent" },
              ],
            ]}
          />
        </div>

        <motion.div {...enter(0.16)}>
          <BuildCycler reduced={Boolean(reduced)} ready={ready} />
        </motion.div>

        <motion.p
          className="t-lead mt-[clamp(1rem,1.5vw,1.375rem)] max-w-[56ch] text-[var(--on-surface)]"
          {...enter(0.22)}
        >
          {heroLead}
        </motion.p>

        <motion.div
          className="mt-[clamp(1.5rem,2.2vw,2.25rem)] flex flex-wrap items-center justify-center gap-x-7 gap-y-4"
          {...enter(0.28)}
        >
          <CtaButton href="/contact" tone="paper" data-cursor="start">
            Book a scoping call
          </CtaButton>
          <Link
            href="#work"
            data-cursor="link"
            className="group relative text-[0.9375rem] font-medium tracking-[-0.01em]"
          >
            See our work
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-[var(--hairline-strong)] transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[var(--accent-contextual)] group-focus-visible:bg-[var(--accent-contextual)]"
            />
          </Link>
        </motion.div>

        <motion.p
          className="mt-[clamp(1rem,1.4vw,1.25rem)] max-w-[46ch] text-[0.8125rem] leading-[1.5] text-[var(--muted-fg)]"
          {...enter(0.34)}
        >
          {heroFounderNote}
        </motion.p>

        <motion.div
          className="mt-[clamp(1.75rem,3vw,2.5rem)] w-full max-w-[46rem] border-t border-[var(--hairline)] pt-[clamp(1rem,1.6vw,1.375rem)]"
          {...enter(0.42)}
        >
          <TrustedBy />
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * The three companies whose software we actually shipped, set as mono
 * wordmarks.
 *
 * No logo files and no invented figures: the names come straight from
 * `projects`, so a fourth case study extends the row for free and nothing here
 * can drift out of sync with the work section below.
 */
function TrustedBy() {
  return (
    <>
      <p className="t-label-sm text-[color-mix(in_oklab,var(--on-surface)_45%,transparent)]">
        {heroTrustedLead}
      </p>

      <ul className="mt-3.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {projects.map((project, index) => (
          <li key={project.name} className="flex items-center gap-6">
            <Link
              href={project.href}
              data-cursor="link"
              className="group relative text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-[var(--muted-fg)] transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[var(--on-surface)] focus-visible:text-[var(--on-surface)] [font-family:var(--font-mono)]"
            >
              {project.name}
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-[var(--accent-contextual)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100"
              />
            </Link>

            {index < projects.length - 1 && (
              <span
                aria-hidden
                className="block size-[3px] rounded-full bg-[color-mix(in_oklab,var(--on-surface)_28%,transparent)]"
              />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * "We build ___", cycling.
 *
 * The width is held by an invisible stack of every term, so the longest one
 * sizes the box once and the line never reflows mid-cycle. Centred this matters
 * more, not less: a reflow now shifts the box symmetrically about the centre,
 * dragging the paragraph and buttons below it, which is far more visible than
 * the same reflow was against a left edge.
 */
function BuildCycler({ reduced, ready }: { reduced: boolean; ready: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || !ready) return;
    const id = window.setInterval(
      () => setIndex((value) => (value + 1) % heroBuilds.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, [reduced, ready]);

  return (
    <p className="mt-[clamp(0.875rem,1.4vw,1.25rem)] flex flex-wrap items-baseline justify-center gap-x-[0.35em] text-[clamp(1.1875rem,2.2vw,1.75rem)] font-medium tracking-[-0.03em]">
      <span className="text-[var(--muted-fg)]">We build</span>

      <span className="relative inline-grid overflow-hidden pb-[0.16em] -mb-[0.16em]">
        {/* ghosts: never painted, but they own the width and height */}
        <span aria-hidden className="invisible col-start-1 row-start-1 grid">
          {heroBuilds.map((word) => (
            <span key={word} className="col-start-1 row-start-1 whitespace-nowrap">
              {word}
            </span>
          ))}
        </span>

        <span className="col-start-1 row-start-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={heroBuilds[index]}
              className="text-gradient inline-block whitespace-nowrap"
              initial={reduced ? { opacity: 0 } : { y: "105%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { y: "-105%", opacity: 0 }}
              transition={{ duration: reduced ? 0.2 : 0.5, ease: EASE }}
            >
              {heroBuilds[index]}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </p>
  );
}
