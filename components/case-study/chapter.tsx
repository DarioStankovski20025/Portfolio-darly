"use client";

import { ImageSlot } from "@/components/ui/image-slot";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import type { Chapter } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

/**
 * One chapter of a case study: heading, paragraphs, then a run of
 * text-and-image beats. Deliberately linear — the sidebar carries navigation,
 * so the page itself only has to read well from top to bottom.
 *
 * `scroll-mt` clears the fixed navbar (and, below lg, the sticky chapter bar)
 * when the sidebar jumps here.
 */
export function ChapterSection({
  chapter,
  index,
  className,
}: {
  chapter: Chapter;
  index: number;
  className?: string;
}) {
  const hasImages = chapter.blocks?.some((block) => block.image !== undefined);

  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-heading`}
      className={cn("scroll-mt-[9rem] lg:scroll-mt-[7rem]", className)}
    >
      <Reveal y={12} className="flex items-center gap-3">
        <span className="t-label-sm text-[var(--accent-contextual)]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="t-label-sm text-[var(--muted-fg)]">{chapter.label}</span>
      </Reveal>

      <div className="mt-5">
        <TextReveal
          as="h2"
          id={`${chapter.id}-heading`}
          className="t-h2 max-w-[20ch]"
          lines={chapter.heading.map((line) => [{ text: line }])}
        />
      </div>

      {chapter.body && (
        <div className="mt-[clamp(1.5rem,2.5vw,2rem)] flex flex-col gap-5">
          {chapter.body.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className="t-lead max-w-[62ch]">{paragraph}</p>
            </Reveal>
          ))}
        </div>
      )}

      {chapter.tags && (
        <Reveal delay={0.08}>
          <ul className="mt-8 flex flex-wrap gap-2">
            {chapter.tags.map((tag) => (
              <li key={tag} className="tag">
                {tag}
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {/* Beats: with images this alternates text → image → text → image.
          Without them it collapses to a clean two-column card grid. */}
      {chapter.blocks &&
        (hasImages ? (
          <div className="mt-[clamp(2.5rem,5vw,4rem)] flex flex-col gap-[clamp(2.5rem,5vw,4rem)]">
            {chapter.blocks.map((block) => (
              <div key={block.title}>
                <Reveal y={16}>
                  <h3 className="text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-[1.15] tracking-[-0.03em]">
                    {block.title}
                  </h3>
                  <p className="t-body mt-3 max-w-[58ch]">{block.body}</p>
                </Reveal>

                {block.image !== undefined && (
                  <ImageSlot
                    className="mt-6"
                    image={block.image}
                    aspect="1521/821"
                    caption={
                      block.image
                        ? undefined
                        : "Further screens to be added"
                    }
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-[clamp(2rem,3.5vw,3rem)] grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2">
            {chapter.blocks.map((block, i) => (
              <Reveal
                key={block.title}
                delay={i * 0.05}
                y={16}
                className="flex flex-col gap-3 bg-[var(--surface)] p-[clamp(1.25rem,2vw,1.85rem)]"
              >
                <span className="t-label-sm text-[var(--accent-contextual)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[clamp(1.0625rem,1.5vw,1.25rem)] font-medium leading-[1.2] tracking-[-0.025em]">
                  {block.title}
                </h3>
                <p className="t-body max-w-[46ch] text-[0.9375rem]">{block.body}</p>
              </Reveal>
            ))}
          </div>
        ))}

      {chapter.image !== undefined && (
        <ImageSlot className="mt-[clamp(2rem,4vw,3rem)]" image={chapter.image} aspect="1521/821" />
      )}
    </section>
  );
}
