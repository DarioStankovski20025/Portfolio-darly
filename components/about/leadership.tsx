"use client";

import Image from "next/image";

import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TextReveal } from "@/components/ui/text-reveal";

/**
 * Leadership.
 *
 * Portraits render at their native 5:4 ratio so neither face is cropped by a
 * ratio chosen without seeing them. Retune the aspect box once the framing is
 * known.
 */
const PEOPLE = [
  {
    name: "Dario Stankovski",
    role: "Chief Executive Officer",
    image: "/images/ceo_profile.webp",
    body: "Leads strategy and the client relationship — what gets built, in what order, and why it is worth building at all.",
  },
  {
    name: "Mila Angelovska",
    role: "Chief Technology Officer",
    image: "/images/cto_profile.webp",
    body: "Leads architecture and engineering — how the product is built so it stays fast, extendable and cheap to change.",
  },
];

export function Leadership() {
  return (
    <section className="section-y bg-paper d-leadership">
      <div className="shell">
        <div className="grid gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel size="lg" className="mb-6">
              Leadership
            </SectionLabel>
            <TextReveal
              as="h2"
              className="t-h2 max-w-[18ch]"
              lines={[
                [{ text: "The people you meet" }],
                [
                  { text: "are the people who " },
                  { text: "build it", className: "editorial" },
                  { text: ".", className: "dot-accent" },
                ],
              ]}
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.06}>
              <p className="t-body max-w-[40ch]">
                Meet the people behind the strategy, design and development of your project.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-[clamp(2.5rem,4vw,3.5rem)] grid gap-[clamp(1.5rem,3vw,2.5rem)] sm:grid-cols-2">
          {PEOPLE.map((person, index) => (
            <Reveal key={person.name} delay={index * 0.08} y={22}>
              <figure className="group m-0">
                <div className="relative aspect-[1402/1122] w-full overflow-hidden rounded-[6px] border border-[var(--hairline)] bg-paper-2">
                  <Image
                    src={person.image}
                    alt={`${person.name}, ${person.role} at Darly`}
                    fill
                    sizes="(min-width: 640px) 46vw, 100vw"
                    className="object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>

                <figcaption className="mt-5">
                  <div className="flex items-baseline gap-3">
                    <span className="t-label-sm text-[var(--accent-contextual)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[clamp(1.25rem,2vw,1.625rem)] font-medium leading-tight tracking-[-0.03em]">
                      {person.name}
                    </h3>
                  </div>
                  <p className="t-label-sm mt-2.5 text-[var(--muted-fg)]">
                    {person.role}
                  </p>
                  <p className="t-body mt-4 max-w-[42ch]">{person.body}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
