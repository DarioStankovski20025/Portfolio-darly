import type { Metadata } from "next";

import { CaseStudyPage } from "@/components/case-study/case-study-page";
import { caseStudies } from "@/lib/case-studies";

const study = caseStudies.level7;

export const metadata: Metadata = {
  title: { absolute: study.seo.title },
  description: study.seo.description,
  alternates: { canonical: "/case-studies/level7" },
  openGraph: {
    title: study.seo.title,
    description: study.seo.description,
    url: "/case-studies/level7",
    type: "article",
    images: [{ url: study.image }],
  },
};

export default function Level7CaseStudy() {
  return <CaseStudyPage study={study} />;
}
