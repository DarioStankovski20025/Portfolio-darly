"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { Bloom } from "@/components/ui/bloom";
import { ArrowGlyph, TextLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TextReveal } from "@/components/ui/text-reveal";
import { projects, type Project } from "@/lib/content";
import { EASE } from "@/lib/motion";

/**
 * Selected work.
 *
 * Three cards, side by side. They used to be three tall alternating rows, which
 * read well but made the proof section enormous — and the proof section is the
 * one people scan rather than read. Everything factual about a project is still
 * visible without hovering, clicking or waiting; it is just legible in one
 * glance now instead of three scrolls.
 *
 * Runs on a *light* chapter deliberately, and the cards stay white for the same
 * reason: this sits between two dark chapters, and three dark cards would leave
 * the light band surviving only as the gutters between them — the alternation
 * the whole page is built on would collapse at exactly the point it is doing the
 * most work. The dark device frame inside each card is what the dark product
 * screenshots need to sit on.
 *
 * `overflow-x-clip`, never `overflow-hidden` — it is containing `<Bloom>`, and
 * `overflow: hidden` on a section like this clips more than intended.
 */
export function SelectedWork() {
  return (
    <section
      id="work"
      className="relative isolate overflow-x-clip bg-paper pb-[clamp(3.5rem,6vw,6rem)] pt-[clamp(3.5rem,6vw,7rem)]"
    >
      <Bloom preset="rise" />
      <div className="shell">
        <div className="grid gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel className="mb-6">Selected work</SectionLabel>
            <TextReveal
              as="h2"
              className="t-h2"
              lines={[
                [
                  { text: "Selected " },
                  { text: "work", className: "editorial" },
                  { text: ".", className: "dot-accent" },
                ],
              ]}
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.06}>
              <p className="t-body max-w-[44ch]">
                Platforms, SaaS products and digital systems designed and developed
                by Darly.
              </p>
            </Reveal>
          </div>
        </div>

        {/*
          Same `.shell` as the heading above, so the grid's left edge lines up
          with it. A tighter shell here would inset the cards by ~140px against
          the heading, which reads as a bug on a page set this precisely.
        */}
        <ul className="mt-[clamp(2rem,4vw,3.5rem)] grid gap-[clamp(1rem,1.6vw,1.75rem)] md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
        </ul>

        <div className="mt-[clamp(3rem,5vw,4.5rem)]">
          <div className="h-px w-full bg-[var(--hairline)]" />
          <Reveal className="pt-6">
            <TextLink href="/case-studies">All case studies</TextLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 180, damping: 20, mass: 0.5 });
  const rotateY = useSpring(ry, { stiffness: 180, damping: 20, mass: 0.5 });

  // The spotlight is a translated div rather than a gradient whose position is
  // rewritten per frame — the same technique as the hero glow, so the two read
  // as one system, and it costs a composited transform instead of a repaint.
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);

  const onMove = (event: React.PointerEvent) => {
    // `pointerType`, not a media query: this is the gate `Magnetic` already
    // uses, and it correctly ignores a stylus as well as touch.
    if (reduced || event.pointerType !== "mouse" || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const nx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const ny = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    rx.set(-ny * 5);
    ry.set(nx * 5);
    spotX.set(event.clientX - rect.left);
    spotY.set(event.clientY - rect.top);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <li className="h-full">
      <motion.article
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        /*
          `isolation: isolate` and a small radius: Safari can leak content past
          rounded corners on an element mid-3D-transform. `transformPerspective`
          rather than a parent `perspective` + `preserve-3d` keeps the element
          flat, which avoids most of it already.
        */
        className="group relative h-full [isolation:isolate]"
        style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
        /*
          Opacity, y and scale only — never `clipPath`. Collapsing this box to
          zero height would stop its own viewport observer from ever crossing
          its threshold, so the animation would never start and the lazy image
          inside would never enter the viewport to load.
        */
        initial={reduced ? undefined : { opacity: 0, y: 28, scale: 0.985 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      >
        {/*
          The whole card is one link.

          A stretched `::after` on the heading — the other way to do this —
          resolves against the nearest *positioned* ancestor, and the body
          column has to be positioned for the ghost numeral to sit behind it.
          The overlay would have covered the text column only, leaving most of
          the card dead to the pointer. Nothing else inside is a link, so a
          single outer anchor nests nothing; `aria-label` keeps the accessible
          name to the project rather than the whole card's text.
        */}
        <Link
          href={project.href}
          data-cursor="view"
          aria-label={`${project.name} — view project`}
          className="flex h-full flex-col overflow-hidden rounded-[6px] border border-[var(--hairline)] bg-paper-2 shadow-[0_2px_8px_-4px_rgba(7,17,31,0.08)] transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[color-mix(in_oklab,var(--color-accent)_38%,transparent)] hover:shadow-[0_28px_60px_-30px_rgba(36,107,253,0.28)]"
        >
          {/* ---------- spotlight ---------- */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-[1] size-[420px] rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              x: spotX,
              y: spotY,
              marginLeft: -210,
              marginTop: -210,
              background:
                "radial-gradient(circle, rgba(36,107,253,0.10) 0%, transparent 70%)",
            }}
          />

          {/* ---------- the product itself ---------- */}
          <div className="on-dark relative m-[clamp(0.35rem,0.6vw,0.55rem)] overflow-hidden rounded-[4px] bg-device p-1.5">
            {/* Sheen sweeping across on hover. Pure decoration, layered over the
                frame — it can never hide what is underneath. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 -translate-x-full bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.09)_50%,transparent_65%)] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full"
            />

            {/* browser chrome */}
            <div className="flex items-center gap-2 px-1.5 pb-2 pt-1">
              <span className="size-[5px] rounded-full bg-white/20" />
              <span className="size-[5px] rounded-full bg-white/20" />
              <span className="size-[5px] rounded-full bg-white/20" />
              <span className="t-label-sm ml-1.5 truncate text-[var(--muted-fg)]">
                {project.name.toLowerCase()}.app
              </span>
              <span className="ml-auto flex items-center gap-1.5">
                <span className="size-[4px] rounded-full bg-[var(--accent-contextual)]" />
                <span className="t-label-sm text-[var(--muted-fg)]">Live</span>
              </span>
            </div>

            {/* 16/10 rather than the source 1521:821. At card width the native
                ratio is 243px tall, which reads as a banner rather than a screen;
                all three sources are top-down dashboards, so `object-top` loses
                nothing to the crop. */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px]">
              <Image
                src={project.image}
                alt={project.alt}
                fill
                sizes="(min-width: 1600px) 460px, (min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw"
                className="object-cover object-top transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
            </div>
          </div>

          {/* ---------- information ---------- */}
          <div className="relative z-[2] flex flex-1 flex-col p-[clamp(1.1rem,1.5vw,1.5rem)] pt-[clamp(0.75rem,1vw,1rem)]">
            {/* Sits behind everything and never takes a pointer hit. Quieter than
                the full-bleed numeral it replaces — at card scale on white, the
                old 13% tint shouted. */}
            <span
              aria-hidden
              className="t-num pointer-events-none absolute right-3 top-0 select-none text-[clamp(3rem,4vw,4.5rem)] font-medium leading-[0.8] tracking-[-0.06em] text-[color-mix(in_oklab,var(--color-accent)_9%,transparent)]"
            >
              {project.index}
            </span>

            <div className="relative flex items-baseline gap-3">
              <span className="t-num text-[clamp(1.125rem,1.4vw,1.375rem)] font-medium leading-none tracking-[-0.04em] text-[var(--accent-contextual)]">
                {project.index}
              </span>
              <span className="t-label-sm text-[var(--muted-fg)]">{project.year}</span>
            </div>

            <h3 className="relative mt-3 text-[clamp(1.375rem,1.8vw,1.75rem)] font-medium leading-[1.05] tracking-[-0.035em]">
              {project.name}
            </h3>

            <p className="relative mt-1.5 text-[0.9375rem] font-medium text-[var(--accent-contextual)]">
              {project.category}
            </p>

            <p className="t-body relative mt-3 line-clamp-3 text-[0.9375rem]">
              {project.description}
            </p>

            {/* `mt-auto` is what actually aligns the three cards' bottom rows.
                `line-clamp-3` only normalises the description, and the description
                is not the last thing in the card. */}
            <ul className="relative mt-auto flex flex-wrap gap-2 pt-5">
              {project.capabilities.slice(0, 3).map((capability) => (
                <li key={capability} className="tag">
                  {capability}
                </li>
              ))}
            </ul>

            {/* A span, not a TextLink — the card itself is the anchor, and an
                anchor inside an anchor is invalid. The arrow still animates,
                because it runs off `group-hover`. */}
            <span className="relative mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-medium">
              View project
              <ArrowGlyph className="size-[0.95em]" />
            </span>
          </div>
        </Link>
      </motion.article>
    </li>
  );
}
