import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Script from "next/script";


import { CookieConsent } from "@/components/ui/cookie-consent";

import { GTM_ID, gtmBootstrap } from "@/lib/analytics";
import { site } from "@/lib/content";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/** Used sparingly, for the one italic word per headline. */
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Darly — Digital Design & Development Agency",
    template: "%s — Darly",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "digital agency",
    "web design",
    "web development",
    "product design",
    "custom software",
    "Next.js development",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  /*
    Deliberately thin. `url`, `title` and `description` used to live here, and
    because `openGraph` is inherited wholesale by any route that doesn't declare
    its own, /about, /contact and /case-studies all shipped `og:url` pointing at
    the home page. Each route now supplies its own via `pageMetadata`.
  */
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_GB",
  },
  /*
    Card type only. Next fills twitter's title/description/images from the
    resolved openGraph — but only when twitter hasn't already set them, and
    hardcoding them here meant that never happened on any route. Leave them out
    and all eight routes get correct cards for free.
  */
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#070b0f" },
  ],
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // globals.css sets `scroll-behavior: smooth` on html. Without this
      // attribute Next cannot force `auto` during a route change, so the
      // router's scroll reset animates and can be interrupted mid-flight.
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} antialiased`}
    >
      <body className="min-h-svh">
        {/* Google Tag Manager — consent defaults first, see lib/analytics.ts */}
        <Script id="gtm-bootstrap" strategy="afterInteractive">
          {gtmBootstrap}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-[3px] focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>

        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
