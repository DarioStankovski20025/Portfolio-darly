import type { Metadata } from "next";

import { CaseStudyPage } from "@/components/case-study/case-study-page";
import { caseStudies } from "@/lib/case-studies";

const study = caseStudies.optiora;

export const metadata: Metadata = {
  title: { absolute: study.seo.title },
  description: study.seo.description,
  alternates: { canonical: "/case-studies/optiora" },
  openGraph: {
    title: study.seo.title,
    description: study.seo.description,
    url: "/case-studies/optiora",
    type: "article",
    images: [{ url: study.image }],
  },
};

export default function OptioraCaseStudy() {
  return <CaseStudyPage study={study} />;
}
