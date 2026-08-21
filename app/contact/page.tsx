import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { Footer } from "@/components/home/footer";
import { Navbar } from "@/components/home/navbar";
import { InteractiveGrid } from "@/components/ui/interactive-grid";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TextReveal } from "@/components/ui/text-reveal";
import { site, social } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact",
  description:
    "Tell us what you're working on and we'll tell you how we'd approach it. Darly — hello@darly.agency.",
});

const STEPS = [
  {
    index: "01",
    title: "You write",
    body: "A paragraph about the product, the timeline, and the constraint you're most worried about.",
  },
  {
    index: "02",
    title: "We reply within two days",
    body: "With a first read on the problem — and an honest answer if we're not the right team for it.",
  },
  {
    index: "03",
    title: "We talk it through",
    body: "A call to pressure-test scope, sequence and what the first useful version looks like.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main id="main">
        <section className="relative isolate overflow-hidden pb-[clamp(3rem,6vw,5rem)] pt-[clamp(7rem,10vw,10rem)]">
          <div aria-hidden className="absolute inset-0 -z-10 opacity-60">
            <InteractiveGrid spacing={44} radius={210} strength={11} ambient={1.5} link />
          </div>

          <div className="shell">
            <div className="grid gap-[clamp(2.5rem,5vw,4.5rem)] lg:grid-cols-12">
              {/* ---------------- the ask ---------------- */}
              <div className="lg:col-span-5">
                <SectionLabel size="lg" className="mb-6">
                  Contact
                </SectionLabel>

                <TextReveal
                  as="h1"
                  className="t-h2 max-w-[14ch]"
                  immediate
                  lines={[
                    [{ text: "Tell us what" }],
                    [
                      { text: "you're " },
                      { text: "building", className: "editorial" },
                      { text: ".", className: "dot-accent" },
                    ],
                  ]}
                />

                <Reveal delay={0.08}>
                  <p className="t-lead mt-7 max-w-[42ch] text-[var(--on-surface)]">
                    We&apos;ll tell you how we&apos;d approach it — scope, sequence and
                    what the first useful version looks like.
                  </p>
                </Reveal>

                {/* what happens next */}
                <Reveal delay={0.12}>
                  <ol className="mt-[clamp(2rem,3.5vw,3rem)] border-t border-[var(--hairline)]">
                    {STEPS.map((step) => (
                      <li
                        key={step.index}
                        className="flex gap-5 border-b border-[var(--hairline)] py-5"
                      >
                        <span className="t-label-sm shrink-0 pt-1 text-[var(--accent-contextual)]">
                          {step.index}
                        </span>
                        <div>
                          <h2 className="text-[1.0625rem] font-medium tracking-[-0.02em]">
                            {step.title}
                          </h2>
                          <p className="t-body mt-1.5 max-w-[38ch] text-[0.9375rem]">
                            {step.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </Reveal>

                {/* direct routes */}
                <Reveal delay={0.16}>
                  <div className="mt-[clamp(2rem,3vw,2.5rem)] flex flex-col gap-4">
                    <a
                      href={`mailto:${site.email}`}
                      data-cursor="link"
                      className="group relative w-fit text-[clamp(1.0625rem,1.4vw,1.375rem)] font-medium tracking-[-0.015em]"
                    >
                      {site.email}
                      <span
                        aria-hidden
                        className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                      />
                    </a>

                    <ul className="flex flex-wrap gap-x-5 gap-y-2">
                      {social.map((item) => (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            data-cursor="link"
                            className="t-label-sm text-[var(--muted-fg)] transition-colors duration-300 hover:text-[var(--accent-contextual)]"
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>

              {/* ---------------- the form ---------------- */}
              <div className="lg:col-span-7">
                <Reveal y={24} delay={0.06}>
                  <ContactForm />
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
