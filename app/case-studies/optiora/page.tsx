import type { Metadata } from "next";

import { CaseStudyPage } from "@/components/case-study/case-study-page";
import { caseStudies } from "@/lib/case-studies";
import { pageMetadata } from "@/lib/seo";

const study = caseStudies.optiora;

export const metadata: Metadata = pageMetadata({
  path: "/case-studies/optiora",
  title: study.seo.title,
  absoluteTitle: true,
  description: study.seo.description,
  ogType: "article",
});

export default function OptioraCaseStudy() {
  return <CaseStudyPage study={study} />;
}
