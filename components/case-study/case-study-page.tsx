import { ChapterSection } from "@/components/case-study/chapter";
import { CsHero, CsTestimonial, NextCaseStudy } from "@/components/case-study/sections";
import { FinalCta } from "@/components/home/final-cta";
import { Footer } from "@/components/home/footer";
import { Navbar } from "@/components/home/navbar";
import { SectionNav } from "@/components/ui/section-nav";
import { heroTheme, type CaseStudy } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

/**
 * The shared spine of every case study.
 *
 * One linear read — heading, text, image, text, image — with a rail down the
 * side tracking where you are. Structure and rhythm are identical across the
 * three so they read as one body of work; only the hero palette and the
 * screenshots make each feel like its own product.
 */
export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const navItems = study.chapters.map((chapter) => ({
    id: chapter.id,
    label: chapter.label,
  }));

  return (
    <>
      <Navbar />

      <main id="main">
        <div className={cn("relative", heroTheme[study.theme])}>
          <CsHero study={study} />
        </div>

        {/*
          `id` is what the rail measures itself against — it reveals and reports
          progress for this block only, so the hero above and the CTA below
          don't eat most of the bar's range.
        */}
        <div id="cs-chapters" className="section-y">
          <div className="shell">
            {/* outside the grid so it can span the viewport on small screens */}
            <SectionNav items={navItems} variant="bar" trackId="cs-chapters" />

            {/* The rail is `fixed` now rather than a sticky grid child, so it
                keeps travelling past the end of the chapter column. The
                column still starts at 5 to leave the left gutter clear. */}
            <SectionNav items={navItems} variant="rail" trackId="cs-chapters" />

            <div className="grid gap-x-[clamp(2rem,4vw,4rem)] pt-[clamp(2rem,4vw,3rem)] lg:grid-cols-12 lg:pt-0">
              <div className="flex flex-col gap-[clamp(3.5rem,7vw,6rem)] lg:col-span-8 lg:col-start-5">
                {study.chapters.map((chapter, index) => (
                  <ChapterSection key={chapter.id} chapter={chapter} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <CsTestimonial study={study} />
        <NextCaseStudy study={study} />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
