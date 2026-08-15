"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Bloom } from "@/components/ui/bloom";
import { CtaButton, TextLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { projects, testimonials } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ROTATE_MS = 8000;
const T = 0.6;
/** Horizontal drag past this many pixels counts as a deliberate swipe. */
const SWIPE_PX = 80;

/**
 * Client stories.
 *
 * One story at a time on a card that sits in front of the two still to come, so
 * the section shows its own length without needing a row of dots. Cycling stops
 * the moment anyone interacts, and whenever the section is offscreen; the ring
 * around the next arrow is that auto-advance made visible, which is the
 * difference between a carousel that feels alive and one that feels like it
 * moved behind your back.
 *
 * Note: no result or metric appears on these cards. The quotes in `lib/content`
 * are draft copy pending client sign-off and deliberately claim nothing.
 */
export function Testimonial() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const reduced = useReducedMotion();

  const current = testimonials[index];
  const project = projects.find((p) => p.name === current.project);

  const go = useCallback((next: number) => {
    setIndex((next + testimonials.length) % testimonials.length);
  }, []);

  const running = !paused && !reduced && inView;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () => setIndex((value) => (value + 1) % testimonials.length),
      ROTATE_MS,
    );
    return () => window.clearTimeout(id);
  }, [index, running]);

  return (
    <section
      ref={sectionRef}
      className="on-dark section-y relative overflow-hidden bg-ink text-paper"
      aria-roledescription="carousel"
      aria-label="Client stories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Bloom preset="halo" />
      <div
        aria-hidden
        className="grid-lines mask-radial absolute inset-0 -z-10 opacity-40"
      />

      <div className="shell relative">
        <div className="grid gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-12 lg:items-center">
          {/* ---------------- the frame ---------------- */}
          <div className="lg:col-span-4">
            <SectionLabel className="mb-6">Client stories</SectionLabel>
            <h2 className="t-h2 max-w-[12ch]">
              What it&apos;s like to work{" "}
              <span className="editorial">with us</span>
              <span className="dot-accent">.</span>
            </h2>

            <p className="t-body mt-6 max-w-[34ch]">
              Three products, three teams, one way of working.
            </p>

            {/* ---------------- controls ---------------- */}
            <div className="mt-9 flex items-center gap-5 border-t border-[var(--hairline)] pt-6">
              <div
                className="flex items-center gap-1"
                role="tablist"
                aria-label="Choose story"
              >
                {testimonials.map((item, i) => (
                  <button
                    key={item.company}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Story from ${item.company}`}
                    onClick={() => go(i)}
                    data-cursor="link"
                    className="group p-1.5"
                  >
                    <span
                      className={cn(
                        "block h-[3px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        i === index
                          ? "w-8 bg-[var(--accent-contextual)]"
                          : "w-3 bg-[var(--hairline-strong)] group-hover:bg-[var(--muted-fg)]",
                      )}
                    />
                  </button>
                ))}
              </div>

              <div className="ml-auto flex items-center gap-2">
                <ArrowButton label="Previous story" onClick={() => go(index - 1)}>
                  ←
                </ArrowButton>
                <ArrowButton
                  label="Next story"
                  onClick={() => go(index + 1)}
                  ring={{ index, running }}
                >
                  →
                </ArrowButton>
              </div>
            </div>

            {/* The natural next thought after reading three of these is
                "could we work with them" — so answer it here rather than
                making people scroll to the end of the page for it. */}
            <div className="mt-[clamp(1.75rem,3vw,2.5rem)]">
              <CtaButton href="/contact" tone="paper" data-cursor="start">
                Start your project
              </CtaButton>
            </div>
          </div>

          {/* ---------------- the stack ---------------- */}
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="relative">
              {/* Two plates behind the card. Pure depth — never focusable, and
                  they carry no content a screen reader would have to skip. */}
              <span
                aria-hidden
                className="absolute inset-x-[3%] -bottom-3 top-6 hidden rounded-[8px] border border-[var(--hairline)] bg-[var(--surface)] sm:block"
              />
              <span
                aria-hidden
                className="absolute inset-x-[6%] -bottom-6 top-12 hidden rounded-[8px] border border-[var(--hairline)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] sm:block"
              />

              {/* Reserved height so advancing a card never shifts the page. */}
              <div className="relative min-h-[clamp(430px,46vw,560px)]">
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={current.company}
                    className="relative overflow-hidden rounded-[8px] border border-[var(--hairline)] bg-[var(--surface)] p-[clamp(1.15rem,2.2vw,2rem)]"
                    initial={{ opacity: 0, y: 28, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, scale: 0.98 }}
                    transition={{ duration: T, ease: EASE }}
                    drag={reduced ? false : "x"}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.12}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -SWIPE_PX) go(index + 1);
                      else if (info.offset.x > SWIPE_PX) go(index - 1);
                    }}
                  >
                    {/* the product the story is about */}
                    {project && (
                      <div className="overflow-hidden rounded-[5px] border border-[var(--hairline)] bg-device">
                        <div className="flex items-center gap-2 px-3 py-2.5">
                          <span className="size-[5px] rounded-full bg-white/20" />
                          <span className="size-[5px] rounded-full bg-white/20" />
                          <span className="t-label-sm ml-1.5 text-[var(--muted-fg)]">
                            {current.company.toLowerCase()}.app
                          </span>
                        </div>
                        <div className="relative aspect-[1521/821] w-full">
                          <Image
                            src={project.image}
                            alt={project.alt}
                            fill
                            sizes="(min-width: 1024px) 52vw, 100vw"
                            className="pointer-events-none object-cover object-top"
                            draggable={false}
                          />
                        </div>
                      </div>
                    )}

                    <p className="mt-[clamp(1.15rem,2vw,1.6rem)] text-[clamp(1.0625rem,1.75vw,1.4375rem)] font-medium leading-[1.38] tracking-[-0.025em]">
                      <span
                        aria-hidden
                        className="editorial text-gradient mr-1 align-[-0.2em] text-[1.55em] leading-[0]"
                      >
                        &ldquo;
                      </span>
                      {current.quote}
                    </p>

                    <footer className="mt-[clamp(1.15rem,2vw,1.6rem)] flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-[var(--hairline)] pt-5">
                      <span className="rule-gradient block h-8 w-[3px] shrink-0 rounded-full" />
                      <div className="flex flex-col gap-1">
                        <cite className="text-[1.0625rem] font-medium not-italic tracking-[-0.015em]">
                          {current.company}
                        </cite>
                        <span className="t-label-sm text-[var(--muted-fg)]">
                          {current.role}
                        </span>
                      </div>
                      {project && (
                        <span className="ml-auto">
                          <TextLink href={project.href}>Read the story</TextLink>
                        </span>
                      )}
                    </footer>
                  </motion.blockquote>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ArrowButton({
  children,
  label,
  onClick,
  ring,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  /** Present on the "next" button only — draws the auto-advance countdown. */
  ring?: { index: number; running: boolean };
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      data-cursor="link"
      className="relative flex size-11 items-center justify-center rounded-full border border-[var(--hairline-strong)] text-lg transition-colors duration-300 hover:border-[var(--accent-contextual)] hover:text-[var(--accent-contextual)]"
    >
      {ring && <ProgressRing index={ring.index} running={ring.running} />}
      <span aria-hidden>{children}</span>
    </button>
  );
}

/**
 * The 8s auto-advance, drawn.
 *
 * Restarts from zero whenever the story changes or the timer is re-armed —
 * which is exactly what the timeout above does on pause/resume, so the ring
 * never disagrees with the thing it is reporting.
 */
function ProgressRing({ index, running }: { index: number; running: boolean }) {
  const progress = useMotionValue(0);

  useEffect(() => {
    progress.set(0);
    if (!running) return;
    const controls = animate(progress, 1, {
      duration: ROTATE_MS / 1000,
      ease: "linear",
    });
    return () => controls.stop();
  }, [index, running, progress]);

  return (
    <svg
      aria-hidden
      viewBox="0 0 44 44"
      className="pointer-events-none absolute -inset-px size-[calc(100%+2px)] -rotate-90"
    >
      <motion.circle
        cx={22}
        cy={22}
        r={21}
        fill="none"
        stroke="var(--color-accent-2)"
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: progress }}
      />
    </svg>
  );
}
