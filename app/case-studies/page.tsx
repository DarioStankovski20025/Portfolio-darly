import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FinalCta } from "@/components/home/final-cta";
import { Footer } from "@/components/home/footer";
import { Navbar } from "@/components/home/navbar";
import { ArrowGlyph } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TextReveal } from "@/components/ui/text-reveal";
import { caseStudyList } from "@/lib/case-studies";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/case-studies",
  title: "Case Studies",
  description:
    "Platforms, SaaS products and digital systems designed and developed by Darly — Optiora, Level7 and Invoomed.",
});

export default function CaseStudiesIndex() {
  return (
    <>
      <Navbar />

      <main id="main">
        <section className="pb-[clamp(2rem,4vw,3rem)] pt-[clamp(7rem,10vw,10rem)]">
          <div className="shell">
            <SectionLabel size="lg" className="mb-6">
              Case studies
            </SectionLabel>
            <TextReveal
              as="h1"
              className="t-display max-w-[16ch]"
              immediate
              lines={[
                [{ text: "Systems we designed" }],
                [
                  { text: "and " },
                  { text: "engineered", className: "editorial" },
                  { text: ".", className: "dot-accent" },
                ],
              ]}
            />
            <Reveal delay={0.08}>
              <p className="t-lead mt-7 max-w-[54ch]">
                Three platforms built end to end — an AI ecommerce product, a real
                estate operations system, and a business management platform.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="pb-[clamp(3rem,6vw,6rem)]">
          <div className="shell flex flex-col gap-[clamp(3rem,6vw,5rem)]">
            {caseStudyList.map((study) => (
              <Reveal key={study.slug} y={22}>
                <Link
                  href={`/case-studies/${study.slug}`}
                  data-cursor="view"
                  className="group grid items-center gap-[clamp(1.5rem,3vw,3.5rem)] lg:grid-cols-12"
                >
                  <div className="lg:col-span-4">
                    <div className="flex items-baseline gap-4">
                      <span className="t-num text-[clamp(1.75rem,2.6vw,2.5rem)] font-medium leading-none tracking-[-0.04em] text-[var(--accent-contextual)]">
                        {study.index}
                      </span>
                      <span className="t-label-sm text-[var(--muted-fg)]">
                        {study.year}
                      </span>
                    </div>

                    <h2 className="mt-4 text-[clamp(2rem,3.6vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.04em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                      {study.name}
                    </h2>
                    <p className="mt-3 text-[clamp(0.9375rem,1.15vw,1.0625rem)] font-medium text-[var(--accent-contextual)]">
                      {study.category}
                    </p>
                    <p className="t-body mt-5 max-w-[40ch]">{study.supporting}</p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {study.services.slice(0, 4).map((service) => (
                        <li key={service} className="tag">
                          {service}
                        </li>
                      ))}
                    </ul>

                    <span className="mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium">
                      View case study
                      <ArrowGlyph className="size-4" />
                    </span>
                  </div>

                  <div className="lg:col-span-7 lg:col-start-6">
                    <div className="on-dark overflow-hidden rounded-[6px] border border-[var(--hairline)] bg-device p-1.5 transition-colors duration-300 group-hover:border-[var(--hairline-strong)]">
                      <div className="relative aspect-[1521/821] w-full overflow-hidden rounded-[3px]">
                        <Image
                          src={study.image}
                          alt={study.alt}
                          fill
                          sizes="(min-width: 1024px) 58vw, 100vw"
                          className="object-cover object-top transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
