import type { Metadata } from "next";

import { Leadership } from "@/components/about/leadership";
import { FinalCta } from "@/components/home/final-cta";
import { Footer } from "@/components/home/footer";
import { Navbar } from "@/components/home/navbar";
import { TextLink } from "@/components/ui/button";
import { InteractiveGrid } from "@/components/ui/interactive-grid";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TextReveal } from "@/components/ui/text-reveal";
import { reasons, stackGroups } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Darly is an AI, design and development agency. Strategy, design and engineering stay together instead of being split between vendors.",
  alternates: { canonical: "/about" },
};

const HOW_WE_WORK = [
  {
    index: "01",
    title: "We start with the business, not the brief",
    body: "Before anything is designed we map how the work actually happens today — where the friction is, what people work around, and what a fix would have to respect.",
  },
  {
    index: "02",
    title: "Design decisions are made by people who build",
    body: "Interface work happens with engineering in the room. That removes the round of rework where a design meets reality for the first time.",
  },
  {
    index: "03",
    title: "We ship in slices, not in one delivery",
    body: "Working software early, then extended. It keeps the feedback loop short and the direction correctable while correcting is still cheap.",
  },
  {
    index: "04",
    title: "The system outlives the engagement",
    body: "Components, patterns and documentation are part of the deliverable, so a team can extend the product without us.",
  },
];

const DISCIPLINES = [
  "Product strategy",
  "UX architecture",
  "Interface design",
  "Design systems",
  "Frontend engineering",
  "Backend & APIs",
  "AI integration",
  "Automation",
  "Infrastructure",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main id="main">
        {/* ---------------- hero ---------------- */}
        <section className="relative isolate overflow-hidden pb-[clamp(3rem,5vw,4.5rem)] pt-[clamp(7rem,10vw,10rem)]">
          <div aria-hidden className="absolute inset-0 -z-10 opacity-60">
            <InteractiveGrid spacing={44} radius={200} strength={10} ambient={1.4} link />
          </div>

          <div className="shell">
            <SectionLabel size="lg" className="mb-6">
              About us
            </SectionLabel>
            <TextReveal
              as="h1"
              className="t-display max-w-[18ch]"
              immediate
              lines={[
                [{ text: "A small team that" }],
                [
                  { text: "builds the " },
                  { text: "whole thing", className: "editorial" },
                  { text: ".", className: "dot-accent" },
                ],
              ]}
            />

            <div className="mt-[clamp(2rem,3.5vw,3rem)] grid gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-12">
              <Reveal delay={0.06} className="lg:col-span-6">
                <p className="t-lead max-w-[54ch] text-[var(--on-surface)]">
                  Darly is an AI, design and development agency. We work with
                  companies whose current tools, templates or systems have started to
                  limit how the business can grow — and we design and engineer the
                  next version of their product.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
                <p className="t-body max-w-[46ch]">
                  Strategy, design and engineering stay in the same team. That is the
                  whole operating model, and most of what makes the work move
                  quickly.
                </p>
                <div className="mt-7">
                  <TextLink href="/case-studies">See the work</TextLink>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- position ---------------- */}
        <section className="section-y bg-paper-2">
          <div className="shell">
            <div className="grid gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-12">
              <div className="lg:col-span-3">
                <SectionLabel size="lg">What we are</SectionLabel>
              </div>
              <div className="lg:col-span-9">
                <TextReveal
                  as="h2"
                  className="t-h2 max-w-[22ch]"
                  lines={[
                    [{ text: "Not a design studio" }],
                    [{ text: "that outsources the build." }],
                  ]}
                />
                <div className="mt-[clamp(1.75rem,3vw,2.5rem)] grid gap-8 lg:grid-cols-2">
                  <Reveal>
                    <p className="t-lead max-w-[50ch]">
                      Most agencies stop at one edge of the problem. A design studio
                      hands over files. A dev shop waits for them. The gap between the
                      two is where budget and months disappear.
                    </p>
                  </Reveal>
                  <Reveal delay={0.06}>
                    <p className="t-lead max-w-[50ch]">
                      We hold both sides. The people who decide how a product should
                      work are the people who make it work — through strategy, design,
                      frontend, backend, integrations and deployment.
                    </p>
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Leadership />

        {/* ---------------- how we work ---------------- */}
        <section className="section-y">
          <div className="shell">
            <SectionLabel size="lg" className="mb-6">
              How we work
            </SectionLabel>
            <TextReveal
              as="h2"
              className="t-h2 max-w-[18ch]"
              lines={[
                [{ text: "Four habits that" }],
                [
                  { text: "shape every " },
                  { text: "project", className: "editorial" },
                  { text: ".", className: "dot-accent" },
                ],
              ]}
            />

            <div className="mt-[clamp(2.5rem,4vw,3.5rem)] border-t border-[var(--hairline)]">
              {HOW_WE_WORK.map((item, i) => (
                <Reveal
                  key={item.index}
                  delay={i * 0.04}
                  y={16}
                  className="grid gap-x-8 gap-y-3 border-b border-[var(--hairline)] py-[clamp(1.75rem,2.6vw,2.5rem)] lg:grid-cols-12"
                >
                  <span className="t-label text-[var(--accent-contextual)] lg:col-span-1">{item.index}</span>
                  <h3 className="text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-[1.15] tracking-[-0.03em] lg:col-span-5">
                    {item.title}
                  </h3>
                  <p className="t-body max-w-[52ch] lg:col-span-5 lg:col-start-8">
                    {item.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- why clients choose us ---------------- */}
        <section className="on-dark bg-ink py-[clamp(3.5rem,6vw,6rem)] text-paper">
          <div className="shell">
            <SectionLabel size="lg" className="mb-6">
              Why Darly
            </SectionLabel>
            <TextReveal
              as="h2"
              className="t-h2 max-w-[20ch]"
              lines={[
                [{ text: "What clients tell us" }],
                [
                  { text: "they " },
                  { text: "notice first", className: "editorial" },
                  { text: ".", className: "dot-accent" },
                ],
              ]}
            />

            <div className="mt-[clamp(2.5rem,4vw,3.5rem)] grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2">
              {reasons.map((reason, i) => (
                <Reveal
                  key={reason.index}
                  delay={i * 0.05}
                  y={16}
                  className="flex flex-col gap-4 bg-ink p-[clamp(1.5rem,2.4vw,2.25rem)]"
                >
                  <span className="t-label-sm text-[var(--accent-contextual)]">{reason.index}</span>
                  <h3 className="t-h3 max-w-[22ch]">{reason.title}</h3>
                  <p className="t-body max-w-[44ch]">{reason.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- disciplines + stack ---------------- */}
        <section className="section-y bg-paper-2">
          <div className="shell">
            <div className="grid gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionLabel size="lg" className="mb-6">
                  Disciplines
                </SectionLabel>
                <TextReveal
                  as="h2"
                  className="t-h2"
                  lines={[[{ text: "One team," }], [{ text: "nine disciplines." }]]}
                />
                <Reveal delay={0.06}>
                  <ul className="mt-8 flex flex-wrap gap-2">
                    {DISCIPLINES.map((item) => (
                      <li key={item} className="tag">
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>

              <div className="lg:col-span-6 lg:col-start-7">
                <Reveal delay={0.08}>
                  <p className="t-label-sm mb-5 text-[var(--muted-fg)]">
                    Tools we reach for
                  </p>
                  <div className="grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2">
                    {stackGroups.map((group) => (
                      <div
                        key={group.group}
                        className="flex flex-col gap-2.5 bg-[var(--surface)] p-[clamp(1rem,1.5vw,1.35rem)]"
                      >
                        <span className="t-label-sm text-[var(--muted-fg)]">
                          {group.group}
                        </span>
                        <ul className="flex flex-col gap-1">
                          {group.items.map((item) => (
                            <li
                              key={item}
                              className="text-[0.9375rem] font-medium tracking-[-0.01em]"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
