import type { Metadata } from "next";

import { CaseStudyPage } from "@/components/case-study/case-study-page";
import { caseStudies } from "@/lib/case-studies";
import { pageMetadata } from "@/lib/seo";

const study = caseStudies.level7;

export const metadata: Metadata = pageMetadata({
  path: "/case-studies/level7",
  title: study.seo.title,
  absoluteTitle: true,
  description: study.seo.description,
  ogType: "article",
});

export default function Level7CaseStudy() {
  return <CaseStudyPage study={study} />;
}
