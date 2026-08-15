import type { MetadataRoute } from "next";

import { caseStudyList } from "@/lib/case-studies";
import { nav, site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    ...nav.map((item) => ({
      url: `${site.url}${item.href}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...caseStudyList.map((study) => ({
      url: `${site.url}/case-studies/${study.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
