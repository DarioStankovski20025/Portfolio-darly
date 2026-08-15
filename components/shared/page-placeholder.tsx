import { Footer } from "@/components/home/footer";
import { Navbar } from "@/components/home/navbar";
import { CtaButton, TextLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { TextReveal } from "@/components/ui/text-reveal";

/**
 * Holding page for the routes the navigation prepares.
 *
 * Only the homepage was in scope, but shipping dead links on a site whose whole
 * argument is craft would undercut it — so each route resolves to something
 * on-brand until the real page is built.
 */
export function PagePlaceholder({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <>
      <Navbar />
      <main
        id="main"
        className="flex min-h-[100svh] flex-col justify-center pb-[clamp(4rem,10vw,8rem)] pt-[clamp(8rem,16vw,12rem)]"
      >
        <div className="shell">
          <SectionLabel className="mb-10">{label}</SectionLabel>

          <TextReveal
            as="h1"
            className="t-display max-w-[14ch]"
            immediate
            lines={[[{ text: title }, { text: ".", className: "dot-accent" }]]}
          />

          <p className="t-lead mt-10 max-w-[46ch]">{body}</p>

          <div className="mt-14 flex flex-wrap items-center gap-10">
            <CtaButton href="/contact">Start a project</CtaButton>
            <TextLink href="/">Back to home</TextLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
