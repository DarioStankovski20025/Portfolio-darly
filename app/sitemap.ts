import {offers,groups} from "@/lib/offers";
import type { MetadataRoute } from "next";

import { caseStudyList } from "@/lib/case-studies";
import { nav, site } from "@/lib/content";

/**
 * A fixed date, not `new Date()`.
 *
 * Building the timestamp at request time made every URL report "modified just
 * now" on every single crawl, which search engines discount outright — a
 * `lastmod` that is always current carries no information. Bump this by hand
 * when the content actually changes.
 */
const LAST_MODIFIED = new Date("2026-08-18");

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = LAST_MODIFIED;

  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    ...[...offers,...groups].map(o=>({url:`${site.url}/services/${o.slug}`,lastModified})),
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
