import type { Metadata } from "next";

import { FinalCta } from "@/components/home/final-cta";
import { Footer } from "@/components/home/footer";
import { HeroBackdrop } from "@/components/home/hero-backdrop";
import { Navbar } from "@/components/home/navbar";
import { PipelineTimeline } from "@/components/services/pipeline-timeline";
import { ServiceChooser } from "@/components/services/service-chooser";
import { TextLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TextReveal } from "@/components/ui/text-reveal";
import { stackGroups } from "@/lib/content";
import { engagements } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/services",
  title: "Services",
  description:
    "AI products, web applications, SaaS platforms, high-end websites and custom software — designed and engineered by one senior team.",
});

/**
 * Services.
 *
 * The page used to be one long column: five services, each rendering two lead
 * paragraphs, five described cards, six chips and three bullets, with the same
 * three sub-headings repeated verbatim five times. Every word of that is still
 * here — it just lives inside `ServiceChooser`, one service at a time, behind a
 * plain-English sentence and a disclosure.
 */
export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <main id="main">
        {/* ---------------- hero ---------------- */}
        <section className="on-dark relative isolate overflow-hidden bg-void pb-[clamp(3rem,5vw,4.5rem)] pt-[clamp(7rem,10vw,10rem)] text-paper">
          <HeroBackdrop />

          <div className="shell">
            <SectionLabel size="lg" className="mb-6">
              Services
            </SectionLabel>
            <TextReveal
              as="h1"
              className="t-display max-w-[16ch]"
              immediate
              blur={7}
              lines={[
                [{ text: "Five things we" }],
                [
                  { text: "build " },
                  { text: "properly", className: "text-gradient" },
                  { text: ".", className: "dot-accent" },
                ],
              ]}
            />

            <div className="mt-[clamp(2rem,3.5vw,3rem)] grid gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-12">
              <Reveal delay={0.06} className="lg:col-span-6">
                <p className="t-lead max-w-[54ch] text-[var(--on-surface)]">
                  Most engagements combine two or three of these. All of them are
                  delivered by the same team — strategy, design and engineering stay
                  together instead of being split between vendors.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
                <p className="t-body max-w-[44ch]">
                  Not sure which one you need? Describe the problem and we&apos;ll
                  tell you — including when the answer is that you don&apos;t need
                  us.
                </p>
                <div className="mt-6">
                  <TextLink href="/contact">Start a conversation</TextLink>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- the five, one at a time ---------------- */}
        <ServiceChooser />

        {/* ---------------- how the work runs ---------------- */}
        <PipelineTimeline />

        {/* ---------------- engagement models ---------------- */}
        <section className="on-dark bg-ink py-[clamp(3.5rem,6vw,6rem)] text-paper">
          <div className="shell">
            <SectionLabel size="lg" className="mb-6">
              How we engage
            </SectionLabel>
            <TextReveal
              as="h2"
              className="t-h2 max-w-[20ch]"
              lines={[
                [{ text: "Three ways to" }],
                [
                  { text: "work with " },
                  { text: "us", className: "editorial" },
                  { text: ".", className: "dot-accent" },
                ],
              ]}
            />

            <div className="mt-[clamp(2.5rem,4vw,3.5rem)] grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] lg:grid-cols-3">
              {engagements.map((item, index) => (
                <Reveal
                  key={item.title}
                  delay={index * 0.06}
                  y={16}
                  className="flex flex-col gap-4 bg-ink p-[clamp(1.5rem,2.4vw,2.25rem)]"
                >
                  <span className="t-label-sm text-[var(--accent-contextual)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="t-h3">{item.title}</h3>
                  <p className="t-body max-w-[42ch]">{item.body}</p>
                  <p className="t-label-sm mt-auto pt-4 text-[var(--muted-fg)]">
                    {item.fit}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- stack ---------------- */}
        <section className="section-y bg-paper-2">
          <div className="shell">
            <div className="grid gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-12">
              <div className="lg:col-span-4">
                <SectionLabel size="lg" className="mb-6">
                  Stack
                </SectionLabel>
                <TextReveal
                  as="h2"
                  className="t-h2"
                  lines={[
                    [{ text: "Chosen for" }],
                    [{ text: "the product." }],
                  ]}
                />
                <Reveal delay={0.06}>
                  <p className="t-body mt-6 max-w-[38ch]">
                    We pick the stack around what the product needs today — and
                    where it needs to go next.
                  </p>
                </Reveal>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <div className="grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
                  {stackGroups.map((group, index) => (
                    <Reveal
                      key={group.group}
                      delay={(index % 3) * 0.04}
                      y={14}
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
                    </Reveal>
                  ))}
                </div>
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
