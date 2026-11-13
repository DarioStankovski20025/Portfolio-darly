import type { Metadata } from "next";
import Link from "next/link";

import { AutomationForm } from "@/components/automation/automation-form";
import { pageMetadata } from "@/lib/seo";

/*
  Link-only landing page, like /audit: not in the navbar or sitemap, and kept
  out of search results. Share the URL directly.
*/
export const metadata: Metadata = {
  ...pageMetadata({
    path: "/automation",
    title: "Free Automation Plan",
    description: "Tell us how your business runs and what you still do by hand. We’ll send you a free, practical plan of what can be automated — within two working days.",
  }),
  robots: { index: false, follow: false },
};

const AREAS = [
  { title: "Leads & follow-ups", body: "Enquiries captured, sorted and answered automatically — nobody forgotten." },
  { title: "Quotes, invoices & payments", body: "Documents generated from your data, sent on time, and chased for you." },
  { title: "Orders, stock & reporting", body: "No more copying between spreadsheets, inboxes and systems." },
  { title: "Bookings & customer support", body: "Scheduling, reminders and the common questions handled by AI." },
];

export default function AutomationPage() {
  return (
    <div className="sa-page">
      <div className="sa-backdrop" aria-hidden="true" />
      <header className="sa-top">
        <Link href="/" className="sa-logo" aria-label="Darly home">darly<span>®</span></Link>
        <span className="sa-tag"><i aria-hidden="true" />FREE AUTOMATION PLAN</span>
      </header>

      <main id="main" className="sa-main au-main">
        <section className="sa-intro">
          <span className="sa-eyebrow">FREE · PERSONAL · 2 WORKING DAYS</span>
          <h1>Stop doing by hand what <em>software can do</em> for you.</h1>
          <p>Tell us about your business and the repetitive work that eats your week. We’ll come back with a clear plan: what can be automated, which tools to use, and how much time it gives back.</p>
          <div className="au-stats" aria-label="What to expect">
            <div><b>2</b><span>working days<br/>to your plan</span></div>
            <div><b>0</b><span>cost or<br/>obligation</span></div>
            <div><b>1</b><span>plan made for<br/>your business</span></div>
          </div>
        </section>

        <section className="sa-form-col" aria-label="Request your automation plan">
          <AutomationForm />
        </section>

        <section className="sa-areas" aria-labelledby="au-areas-title">
          <span id="au-areas-title" className="sa-eyebrow">WHAT WE OFTEN AUTOMATE</span>
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
