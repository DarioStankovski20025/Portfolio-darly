import type { Metadata } from "next";

import { CaseStudyPage } from "@/components/case-study/case-study-page";
import { caseStudies } from "@/lib/case-studies";

const study = caseStudies.invoomed;

export const metadata: Metadata = {
  title: { absolute: study.seo.title },
  description: study.seo.description,
  alternates: { canonical: "/case-studies/invoomed" },
  openGraph: {
    title: study.seo.title,
    description: study.seo.description,
    url: "/case-studies/invoomed",
    type: "article",
    images: [{ url: study.image }],
  },
};

export default function InvoomedCaseStudy() {
  return <CaseStudyPage study={study} />;
}
