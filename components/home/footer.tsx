"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { nav, site, social } from "@/lib/content";
import { EASE } from "@/lib/motion";

const year = new Date().getFullYear();

export function Footer() {
  const reduced = useReducedMotion();

  return (
    <footer className="on-dark relative overflow-hidden border-t border-[var(--hairline)] bg-void pt-[clamp(3rem,5vw,4.5rem)] text-paper">
      <div className="shell">
        <div className="grid gap-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="group inline-flex items-baseline" data-cursor="link">
              <span className="text-[2rem] font-medium leading-none tracking-[-0.05em]">
                {site.wordmark}
              </span>
              <span
                aria-hidden
                className="ml-[0.06em] inline-block size-2 rounded-full bg-[var(--accent-contextual)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-150"
              />
            </Link>
            <p className="t-body mt-6 max-w-[32ch]">
              Digital products for ambitious companies.
            </p>
          </div>

          <nav className="lg:col-span-2 lg:col-start-7" aria-label="Footer navigation">
            <h2 className="t-label text-[var(--muted-fg)]">Navigation</h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="t-label text-[var(--muted-fg)]">Social</h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              {social.map((item) => (
                <li key={item.label}>
                  <FooterLink href={item.href} external>
                    {item.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="t-label text-[var(--muted-fg)]">Contact</h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              <li>
                <FooterLink href={`mailto:${site.email}`} external>
                  {site.email}
                </FooterLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-[clamp(2.5rem,4vw,3.5rem)] flex flex-wrap items-center justify-between gap-4 border-t border-[var(--hairline)] py-6">
          <p className="t-label text-[var(--muted-fg)]">
            © {year} {site.name}
          </p>
          <p className="t-label text-[var(--muted-fg)]">{site.domain}</p>
        </div>
      </div>

      {/* Oversized wordmark, revealed from the baseline */}
      <div className="shell overflow-hidden pb-[clamp(0.5rem,1.5vw,1.5rem)]" aria-hidden>
        <motion.div
          className="flex items-baseline justify-between leading-[0.78]"
          initial={reduced ? undefined : { y: "22%", opacity: 0 }}
          whileInView={reduced ? undefined : { y: "0%", opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.3, ease: EASE }}
        >
          <span className="text-[clamp(4.5rem,20.5vw,20rem)] font-medium tracking-[-0.055em]">
            DARLY
          </span>
          <span className="text-[clamp(4.5rem,20.5vw,20rem)] font-medium tracking-[-0.055em] text-[var(--accent-contextual)]">
            .
          </span>
        </motion.div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className =
    "group relative inline-block text-[0.9375rem] font-medium tracking-[-0.01em] text-paper/80 transition-colors duration-300 hover:text-paper";

  const underline = (
    <span
      aria-hidden
      className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-[var(--accent-contextual)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100"
    />
  );

  if (external) {
    return (
      <a
        href={href}
        data-cursor="link"
        className={className}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noreferrer noopener" }
          : {})}
      >
        {children}
        {underline}
      </a>
    );
  }

  return (
    <Link href={href} data-cursor="link" className={className}>
      {children}
      {underline}
    </Link>
  );
}
