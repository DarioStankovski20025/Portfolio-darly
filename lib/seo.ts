import type { Metadata } from "next";

import { site } from "@/lib/content";

/**
 * Per-route metadata.
 *
 * Three things here are load-bearing and none of them are obvious:
 *
 * 1. **No `twitter` object is returned.** Next derives `twitter.title` /
 *    `.description` / `.images` from the resolved `openGraph` whenever twitter
 *    does not already define them. The root layout used to hardcode the first
 *    two, which permanently blocked that derivation and left every inner page
 *    advertising the home page in its Twitter card. Those keys are gone from
 *    the root now, and adding them back here would re-break the same thing.
 *
 * 2. **`siteName` and `locale` are re-emitted on every route.** `openGraph`
 *    merges as a single key, not field by field — any page that declares one
 *    replaces the parent's outright. Without these two lines here, every page
 *    using this helper would silently drop `og:site_name` and `og:locale`.
 *
 * 3. **`images` defaults to the site card, and is never set to `undefined`.**
 *    The root `opengraph-image.tsx` only reaches routes that don't declare
 *    their own `openGraph` — and every route using this helper declares one, so
 *    without a default they would ship no `og:image` at all. Passing `images`
 *    explicitly for a route that has its own `opengraph-image` file would
 *    suppress that file, because the check Next runs is
 *    `hasOwnProperty("images")` and even `{ images: undefined }` satisfies it.
 *    Hence the explicit `null` escape hatch rather than a bare `undefined`.
 */

/** The site-wide 1200×630 card, rendered by `app/opengraph-image.tsx`. */
const DEFAULT_OG_IMAGE = [
  {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: "Darly — Digital Design & Development Agency",
  },
];
export function pageMetadata(seo: {
  /** Route path with a leading slash and no trailing slash. "/" for home. */
  path: string;
  title: string;
  description: string;
  /** Bypass the "%s — Darly" template, for titles that already carry the brand. */
  absoluteTitle?: boolean;
  ogType?: "website" | "article";
  /**
   * Override the site card. Pass `null` — not `undefined` — for a route that
   * ships its own `opengraph-image` file, so the key is omitted entirely and
   * the file is allowed to apply.
   */
  images?: NonNullable<Metadata["openGraph"]>["images"] | null;
}): Metadata {
  const ogTitle = seo.absoluteTitle ? seo.title : `${seo.title} — ${site.name}`;

  return {
    title: seo.absoluteTitle ? { absolute: seo.title } : seo.title,
    description: seo.description,
    alternates: { canonical: seo.path },
    openGraph: {
      type: seo.ogType ?? "website",
      // Resolved against `metadataBase`. Without this every route inherited the
      // root's absolute URL and claimed to be the home page.
      url: seo.path,
      title: ogTitle,
      description: seo.description,
      siteName: site.name,
      locale: "en_GB",
      ...(seo.images === null ? {} : { images: seo.images ?? DEFAULT_OG_IMAGE }),
    },
  };
}
