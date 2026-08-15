"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { buildSchematics } from "@/components/home/build-schematics";
import { TextLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { caseStudies } from "@/lib/case-studies";
import { DUR, EASE } from "@/lib/motion";
import { services } from "@/lib/services";
import { cn } from "@/lib/utils";

/**
 * The services page, in one control.
 *
 * This replaces a ~2,500-word column in which all five services rendered five
 * stacked sub-blocks each — two lead paragraphs, five described cards, six
 * chips and three bullets — with the same three sub-headings repeated verbatim
 * five times. Nothing was wrong with the copy; there was just no way to tell
 * what Darly does without reading all of it.
 *
 * Now one service is open at a time and leads with a single plain sentence.
 * The long-form copy is still here, still in the DOM for search engines, but it
 * sits behind a disclosure instead of shouting over the next service.
 *
 * Anchors are preserved: `/services#saas-products` still selects and scrolls to
 * that service, and selecting one rewrites the hash, so every link that pointed
 * into the old page still lands correctly.
 */
export function ServiceChooser() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const service = services[active];
  const study = service.caseStudy ? caseStudies[service.caseStudy] : null;
  const Schematic = buildSchematics[service.index];

  const select = useCallback((next: number, pushHash = true) => {
    setActive(next);
    setExpanded(false);
    if (pushHash) {
      window.history.replaceState(null, "", `#${services[next].id}`);
    }
  }, []);

  // Deep links from the old anchor-per-service page, and from the footer.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const index = services.findIndex((item) => item.id === id);
      if (index >= 0) setActive(index);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  /** Roving focus: a tablist is one tab stop, arrows move between options. */
  const onKeyDown = (event: React.KeyboardEvent) => {
    const delta =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : event.key === "Home"
            ? -active
            : event.key === "End"
              ? services.length - 1 - active
              : 0;
    if (delta === 0) return;
    event.preventDefault();
    const next = (active + delta + services.length) % services.length;
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="section-y bg-paper-2">
      <div className="shell">
        <SectionLabel size="lg" className="mb-6">
          What we do
        </SectionLabel>

        {/* ---------------- start here ---------------- */}
        <Reveal>
          <p className="t-h3 max-w-[24ch]">
            Pick the sentence that sounds most like you.
          </p>
        </Reveal>

        <div className="mt-6 grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-5">
          {services.map((item, index) => (
            <Reveal
              key={item.id}
              y={14}
              delay={index * 0.04}
              className="bg-[var(--surface)]"
            >
              <button
                type="button"
                onClick={() => {
                  select(index);
                  panelRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
                data-cursor="link"
                className={cn(
                  "group flex h-full w-full flex-col gap-3 p-[clamp(1rem,1.6vw,1.35rem)] text-left transition-colors duration-300 hover:bg-paper",
                  index === active && "bg-paper",
                )}
              >
                <span
                  className={cn(
                    "t-label-sm transition-colors duration-300",
                    index === active ? "text-[var(--accent-contextual)]" : "text-[var(--muted-fg)]",
                  )}
                >
                  {item.index}
                </span>
                <span className="text-[0.9375rem] font-medium leading-[1.35] tracking-[-0.015em]">
                  &ldquo;{item.bestFor}&rdquo;
                </span>
                <span className="t-label-sm mt-auto pt-2 text-[var(--muted-fg)]">
                  {item.title}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        {/* ---------------- the chooser ---------------- */}
        <div
          ref={panelRef}
          className="mt-[clamp(2.5rem,5vw,4rem)] grid scroll-mt-[7rem] gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-12"
        >
          {/* the five */}
          <div
            role="tablist"
            aria-label="Services"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="border-t border-[var(--hairline)] lg:col-span-5"
          >
            {services.map((item, index) => {
              const isActive = index === active;
              return (
                <button
                  key={item.id}
                  id={item.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="service-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => select(index)}
                  onMouseEnter={() => setActive(index)}
                  data-cursor="link"
                  className="group block w-full scroll-mt-[7rem] border-b border-[var(--hairline)] py-[clamp(1.1rem,1.8vw,1.6rem)] text-left"
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className={cn(
                        "t-label shrink-0 transition-colors duration-300",
                        isActive ? "text-[var(--accent-contextual)]" : "text-[var(--muted-fg)]",
                      )}
                    >
                      {item.index}
                    </span>
                    <h2 className="relative inline-block text-[clamp(1.375rem,2.4vw,2rem)] font-medium leading-[1.05] tracking-[-0.035em]">
                      {item.title}
                      {isActive && (
                        <motion.span
                          layoutId="service-underline"
                          className="rule-gradient absolute -bottom-1.5 left-0 block h-[2px] w-full"
                          transition={{ duration: DUR.base, ease: EASE }}
                        />
                      )}
                    </h2>
                  </div>
                </button>
              );
            })}
          </div>

          {/* the one */}
          <div
            id="service-panel"
            role="tabpanel"
            aria-labelledby={service.id}
            tabIndex={-1}
            className="lg:col-span-6 lg:col-start-7"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: DUR.fast, ease: EASE }}
              >
                <div className="overflow-hidden rounded-[6px] border border-[var(--hairline)] bg-[var(--surface)]">
                  <div className="border-b border-[var(--hairline)] bg-paper p-[clamp(1rem,1.8vw,1.5rem)]">
                    <Schematic />
                  </div>

                  <div className="p-[clamp(1.25rem,2.2vw,2rem)]">
                    {/* the one sentence that has to land */}
                    <p className="text-[clamp(1.0625rem,1.5vw,1.3125rem)] font-medium leading-[1.4] tracking-[-0.02em]">
                      {service.plain}
                    </p>

                    <h3 className="t-label-sm mt-8 text-[var(--muted-fg)]">
                      What that includes
                    </h3>
                    {/* Three, not five. The rest is under "Full detail". */}
                    <ul className="mt-4 flex flex-col gap-3">
                      {service.includes.slice(0, 3).map((item) => (
                        <li key={item.title} className="flex items-start gap-3">
                          <span
                            aria-hidden
                            className="mt-[0.5em] block size-[5px] shrink-0 rounded-full bg-accent"
                          />
                          <span className="text-[0.9375rem] font-medium tracking-[-0.01em]">
                            {item.title}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <h3 className="t-label-sm mt-8 text-[var(--muted-fg)]">
                      What you end up with
                    </h3>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {service.deliverables.map((item) => (
                        <li key={item} className="tag">
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-[var(--hairline)] pt-6">
                      <button
                        type="button"
                        onClick={() => setExpanded((value) => !value)}
                        aria-expanded={expanded}
                        aria-controls={`${service.id}-detail`}
                        data-cursor="link"
                        className="group inline-flex items-center gap-2.5 text-[0.9375rem] font-medium tracking-[-0.01em]"
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "flex size-5 items-center justify-center rounded-full border border-[var(--hairline-strong)] text-[0.7rem] leading-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            expanded && "rotate-45",
                          )}
                        >
                          +
                        </span>
                        {expanded ? "Hide detail" : "Full detail"}
                      </button>

                      {study && (
                        <TextLink href={`/case-studies/${study.slug}`}>
                          See it in {study.name}
                        </TextLink>
                      )}
                    </div>

                    {/*
                      Height-animated rather than unmounted: the copy stays in
                      the DOM for crawlers whether it is open or not, which is
                      the whole reason this is a disclosure and not a filter.
                    */}
                    <motion.div
                      id={`${service.id}-detail`}
                      initial={false}
                      animate={{
                        height: expanded ? "auto" : 0,
                        opacity: expanded ? 1 : 0,
                      }}
                      transition={{ duration: DUR.base, ease: EASE }}
                      className="overflow-hidden"
                      aria-hidden={!expanded}
                    >
                      <div className="pt-6">
                        {service.body.map((paragraph, i) => (
                          <p key={i} className="t-body mt-4 first:mt-0">
                            {paragraph}
                          </p>
                        ))}

                        <h4 className="t-label-sm mt-8 text-[var(--muted-fg)]">
                          Everything included
                        </h4>
                        <dl className="mt-4 flex flex-col gap-4">
                          {service.includes.map((item) => (
                            <div key={item.title}>
                              <dt className="text-[0.9375rem] font-medium tracking-[-0.01em]">
                                {item.title}
                              </dt>
                              <dd className="t-body mt-1 text-[0.9375rem]">
                                {item.body}
                              </dd>
                            </div>
                          ))}
                        </dl>

                        <h4 className="t-label-sm mt-8 text-[var(--muted-fg)]">
                          You probably need this when
                        </h4>
                        <ul className="mt-4 flex flex-col gap-2.5">
                          {service.signals.map((signal) => (
                            <li key={signal} className="flex items-start gap-3">
                              <span
                                aria-hidden
                                className="mt-[0.55em] block size-[5px] shrink-0 rounded-full bg-accent"
                              />
                              <span className="t-body text-[0.9375rem]">
                                {signal}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
