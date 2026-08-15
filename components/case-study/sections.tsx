"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { ArrowGlyph, TextLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TextReveal } from "@/components/ui/text-reveal";
import { caseStudies, type CaseStudy } from "@/lib/case-studies";
import { DUR, EASE } from "@/lib/motion";

/* ------------------------------------------------------------------
   Hero
------------------------------------------------------------------ */

export function CsHero({ study }: { study: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);

  return (
    <section className="relative overflow-hidden pb-[clamp(2.5rem,5vw,4.5rem)] pt-[clamp(7rem,10vw,10rem)]">
      <div className="shell">
        <Reveal y={12} className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="t-label-sm text-[var(--muted-fg)]">
            Case study / {study.index}
          </span>
          <span aria-hidden className="block size-[5px] rounded-full bg-accent" />
          <span className="t-label-sm">{study.eyebrow}</span>
        </Reveal>

        <div className="mt-[clamp(1.5rem,2.5vw,2.5rem)]">
          <TextReveal
            as="h1"
            className="t-display max-w-[18ch]"
            immediate
            lines={study.headline.map((line) => [{ text: line }])}
          />
        </div>

        <div className="mt-[clamp(1.5rem,2.5vw,2.25rem)] grid gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-12">
          <Reveal delay={0.06} className="lg:col-span-6">
            <p className="t-lead max-w-[58ch] text-[var(--on-surface)]">
              {study.supporting}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
              {study.meta.map((item) => (
                <div key={item.label} className="border-t border-[var(--hairline)] pt-3">
                  <dt className="t-label-sm text-[var(--muted-fg)]">{item.label}</dt>
                  <dd className="mt-2 text-[0.9375rem] font-medium tracking-[-0.01em]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      {/* The screenshots are ~1.85:1 — the frame matches, so nothing is cropped. */}
      <div ref={ref} className="shell mt-[clamp(2.5rem,5vw,4rem)]">
        <motion.div
          className="on-dark overflow-hidden rounded-[8px] border border-[var(--hairline)] bg-device p-[clamp(0.3rem,0.5vw,0.5rem)] shadow-[0_60px_120px_-70px_rgba(7,11,15,0.6)]"
          initial={reduced ? undefined : { opacity: 0, y: 24 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: DUR.slow, delay: 0.15, ease: EASE }}
        >
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span className="size-[6px] rounded-full bg-white/20" />
            <span className="size-[6px] rounded-full bg-white/20" />
            <span className="size-[6px] rounded-full bg-white/20" />
            <span className="t-label-sm ml-2 text-white/40">
              {study.name.toLowerCase()}.app
            </span>
          </div>

          <div className="relative aspect-[1521/821] w-full overflow-hidden rounded-[4px]">
            <motion.div
              className="absolute inset-0"
              style={reduced ? undefined : { y, scale }}
            >
              <Image
                src={study.image}
                alt={study.alt}
                fill
                priority
                sizes="(min-width: 1600px) 1520px, 100vw"
                className="object-cover object-top"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Testimonial
------------------------------------------------------------------ */

export function CsTestimonial({ study }: { study: CaseStudy }) {
  return (
    <section className="section-y">
      <div className="shell">
        <div className="grid gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel size="lg">In their words</SectionLabel>
          </div>
          <div className="lg:col-span-9">
            <blockquote>
              <p className="text-[clamp(1.375rem,2.6vw,2.375rem)] font-medium leading-[1.22] tracking-[-0.03em]">
                <span aria-hidden className="editorial mr-1 text-[var(--accent-contextual)]">
                  &ldquo;
                </span>
                {study.testimonial.quote}
                <span aria-hidden className="editorial ml-0.5 text-[var(--accent-contextual)]">
                  &rdquo;
                </span>
              </p>
              <footer className="mt-8 flex items-center gap-4">
                <span className="block h-9 w-0.5 bg-accent" />
                <div className="flex flex-col gap-1.5">
                  <cite className="text-[1.125rem] font-medium not-italic tracking-[-0.015em]">
                    {study.testimonial.company}
                  </cite>
                  <span className="t-label-sm text-[var(--muted-fg)]">
                    {study.testimonial.role}
                  </span>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Next case study
------------------------------------------------------------------ */

export function NextCaseStudy({ study }: { study: CaseStudy }) {
  const next = study.next;
  const nextStudy = caseStudies[next.slug];

  return (
    <section className="on-dark relative overflow-hidden bg-void py-[clamp(3rem,5vw,5rem)] text-paper">
      <div className="shell">
        <Link
          href={`/case-studies/${next.slug}`}
          data-cursor="view"
          className="group grid items-center gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-12"
        >
          <div className="lg:col-span-5">
            <span className="t-label-sm text-[var(--muted-fg)]">Next case study</span>
            <h2 className="mt-5 text-[clamp(2.25rem,4.4vw,3.75rem)] font-medium leading-[0.95] tracking-[-0.04em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
              {next.name}
            </h2>
            <p className="mt-3 text-[clamp(0.95rem,1.15vw,1.125rem)] font-medium text-[var(--accent-contextual)]">
              {next.category}
            </p>
            <span className="mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium">
              View project
              <ArrowGlyph className="size-4" />
            </span>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="overflow-hidden rounded-[6px] border border-[var(--hairline)] transition-colors duration-300 group-hover:border-[var(--hairline-strong)]">
              <div className="relative aspect-[1521/821] w-full overflow-hidden">
                <Image
                  src={nextStudy.image}
                  alt={nextStudy.alt}
                  fill
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="object-cover object-top transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>
        </Link>

        <div className="mt-[clamp(2rem,3vw,2.5rem)] border-t border-[var(--hairline)] pt-6">
          <TextLink href="/case-studies">All case studies</TextLink>
        </div>
      </div>
    </section>
  );
}
