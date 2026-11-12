import type { Metadata } from "next";
import Link from "next/link";

import { StoreAuditForm } from "@/components/audit/store-audit-form";
import { pageMetadata } from "@/lib/seo";

/*
  Link-only landing page: not in the navbar, not in the sitemap, and kept out
  of search results. Share the URL directly (ads, DMs, email outreach).
*/
export const metadata: Metadata = {
  ...pageMetadata({
    path: "/audit",
    title: "Free Store Audit",
    description: "Send us your store link and get a free, hand-written audit of what is costing you sales — delivered to your inbox within two working days.",
  }),
  robots: { index: false, follow: false },
};

const AREAS = [
  { title: "Speed & Core Web Vitals", body: "What slows your pages down on real phones, and what to fix first." },
  { title: "Product page & checkout", body: "Where shoppers hesitate, drop off, or lose trust before paying." },
  { title: "Mobile experience", body: "Navigation, tap targets and layout on the screens most of your buyers use." },
  { title: "SEO & tracking basics", body: "Indexing, metadata and whether your analytics actually record sales." },
];

export default function AuditPage() {
  return (
    <div className="sa-page">
      <div className="sa-backdrop" aria-hidden="true" />
      <header className="sa-top">
        <Link href="/" className="sa-logo" aria-label="Darly home">darly<span>®</span></Link>
        <span className="sa-tag"><i aria-hidden="true" />FREE STORE AUDIT</span>
      </header>

      <main id="main" className="sa-main">
        <section className="sa-intro">
          <span className="sa-eyebrow">FREE · HAND-WRITTEN · 2 WORKING DAYS</span>
          <h1>Find out what’s <em>costing your store</em> sales.</h1>
          <p>Paste your store link. A real person on our team goes through it the way your customers do and sends you a clear, prioritised list of fixes. No call, no obligation.</p>
        </section>

        <section className="sa-form-col" aria-label="Request your audit">
          <StoreAuditForm />
        </section>

        <section className="sa-areas" aria-labelledby="sa-areas-title">
          <span id="sa-areas-title" className="sa-eyebrow">WHAT WE LOOK AT</span>
          <ol>
            {AREAS.map((a, i) => (
              <li key={a.title}>
                <b>0{i + 1}</b>
                <div><h2>{a.title}</h2><p>{a.body}</p></div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="sa-foot">
        <span>© {new Date().getFullYear()} Darly</span>
        <Link href="/">Visit our website ↗</Link>
      </footer>
    </div>
  );
}
