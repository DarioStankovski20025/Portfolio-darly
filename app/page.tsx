import { BuildTransform } from "@/components/home/build-transform";
import { CapabilityBar } from "@/components/home/capability-bar";
import { FinalCta } from "@/components/home/final-cta";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import { Navbar } from "@/components/home/navbar";
import { SelectedWork } from "@/components/home/selected-work";
import { Testimonial } from "@/components/home/testimonial";
import { ToolsOrbit } from "@/components/home/tools-orbit";
import { WebsiteAudit } from "@/components/home/website-audit";
import { WhatWeBuild } from "@/components/home/what-we-build";
import { WhyDarly } from "@/components/home/why-darly";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { site } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

/*
  The home page used to declare no metadata at all and rely entirely on the root
  layout. That worked only by accident, and it stopped working the moment the
  root's openGraph was thinned out so inner routes could describe themselves.
  It is explicit now.
*/
export const metadata = pageMetadata({
  path: "/",
  title: "Darly — Digital Design & Development Agency",
  absoluteTitle: true,
  description: site.description,
});

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  // A stable identifier, so anything that later references the organisation
  // (a breadcrumb, a case study) can point at this node rather than restate it.
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  email: site.email,
  description: site.description,
  logo: `${site.url}/apple-icon`,
  image: `${site.url}/opengraph-image`,
  serviceType: [
    "AI product development",
    "SaaS platforms",
    "Web application development",
    "Custom software",
    "Product design",
    "Business automation",
  ],
  // No `sameAs`: the only social link on file is LinkedIn's homepage rather
  // than a company profile, and a platform root cannot be reconciled to an
  // entity. Add it here once there is a real profile URL.
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, author-controlled structured data.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
      />

      <ScrollProgress />
      <Navbar />

      <main id="main">
        {/*
          Chapters alternate dark → light the whole way down, so no stretch of
          the page settles into one temperature. The only adjacent pair is
          Testimonial → ToolsOrbit, and that is forced from both ends:
          BuildTransform and SelectedWork are light product panels, and the
          orbit is built for a dark surface. They sit on different darks
          (midnight, then the deeper stack) so the seam still reads as a change.
        */}
        <Hero />          {/* dark  */}
        <CapabilityBar /> {/* light */}
        <WhatWeBuild />   {/* dark  */}
        <WebsiteAudit />  {/* light */}
        <WhyDarly />      {/* dark  */}
        <BuildTransform />{/* light */}
        <Testimonial />   {/* dark  */}
        <ToolsOrbit />    {/* dark  */}

        <SelectedWork /> {/* light — dark screenshots need something to sit on */}
        <FinalCta />     {/* dark  */}
      </main>

      <Footer />
    </>
  );
}
