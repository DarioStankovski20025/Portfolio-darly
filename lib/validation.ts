/**
 * Validation rules shared by the forms and the routes that receive them.
 *
 * The rules used to live inline in `contact-form.tsx` and `website-audit.tsx`,
 * which meant the only thing standing between a bot and the inbox was a
 * `preventDefault` it never ran. Server-side checks are mandatory, and once
 * there are two copies of a rule they drift — so there is exactly one copy and
 * both sides import it.
 *
 * HARD CONSTRAINT: this module is imported by `"use client"` components. It may
 * not read `process.env`, import `lib/mail.ts`, or touch a Node builtin. It is
 * the shared boundary, and the boundary is what keeps the SMTP credentials out
 * of the client bundle.
 */

import { MIN_BUDGET, formatAmount, parseAmount, type Currency } from "@/lib/currency";
import { EUR, GBP, USD } from "@/lib/currency";

/** Deliberately permissive. Anything stricter rejects real addresses. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The things people come to us for. Renders as the chip group on the form. */
export const NEEDS = ["Custom Business Software", "SaaS & MVP Development", "AI Business Automation", "Client Portals", "Software Modernization & Integrations", "Ongoing Development", "Shopify Development & CRO", "AI Product Content & Creatives", "E-commerce Operations Automation", "Custom Software & AI Automation", "E-commerce Development & Growth"] as const;

/** Time floor before a submission is plausibly human, in ms. */
export const MIN_ELAPSED_MS = 3000;

/**
 * Upper bounds, server-side only.
 *
 * The client cannot exceed these through the UI; a script can, and an
 * unbounded `message` is how you get a 4MB email.
 */
const MAX = {
  name: 120,
  email: 254, // RFC 5321
  company: 160,
  budget: 24,
  message: 5000,
  needs: 12,
  url: 2048,
} as const;

export type ContactFields = {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
};

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export type ContactPayload = ContactFields & {
  budgetCurrency: Currency["code"];
  needs: string[];
  elapsedMs: number;
  /** Honeypot. Named to avoid autofill — see the route handler. */
  company_url: string;
};

export type AuditPayload = {
  url: string;
  email: string;
  elapsedMs: number;
  company_url: string;
};

/* ------------------------------------------------------------------ */

const CURRENCIES: Record<Currency["code"], Currency> = {
  EUR,
  USD,
  GBP,
};

/** `unknown` → trimmed string, capped. Anything non-string becomes "". */
function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/**
 * "yourcompany.com" → URL, or null.
 *
 * Moved verbatim out of `website-audit.tsx` so the server applies the same
 * normalisation the visitor saw accepted. The hostname must contain a dot —
 * without it "localhost" and every typo'd single word would validate.
 */
export function normaliseUrl(raw: string): URL | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > MAX.url) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    return /\./.test(url.hostname) ? url : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */

export type ContactResult =
  | { ok: true; value: ContactPayload }
  | { ok: false; errors: FieldErrors<keyof ContactFields> };

/**
 * The messages are the ones already on the form — changing them here changes
 * them in the UI, which is the point.
 */
export function validateContact(input: unknown): ContactResult {
  const source = (input ?? {}) as Record<string, unknown>;

  const code = source.budgetCurrency;
  const currency =
    typeof code === "string" && code in CURRENCIES
      ? CURRENCIES[code as Currency["code"]]
      : EUR;

  const value: ContactPayload = {
    name: str(source.name, MAX.name),
    email: str(source.email, MAX.email),
    company: str(source.company, MAX.company),
    budget: str(source.budget, MAX.budget),
    message: str(source.message, MAX.message),
    budgetCurrency: currency.code,
    needs: Array.isArray(source.needs)
      ? source.needs
          .filter((item): item is string => typeof item === "string")
          .filter((item) => (NEEDS as readonly string[]).includes(item))
          .slice(0, MAX.needs)
      : [],
    elapsedMs: num(source.elapsedMs),
    company_url: str(source.company_url, 200),
  };

  const errors: FieldErrors<keyof ContactFields> = {};

  if (value.name.length < 2) errors.name = "Tell us who you are";
  if (!EMAIL_RE.test(value.email)) errors.email = "We need a valid email to reply";
  if (value.message.length < 10)
    errors.message = "A sentence or two about the project is plenty";

  // Below this we are not the right team, and saying so up front is kinder
  // than a reply two days later.
  const budgetValue = parseAmount(value.budget);
  if (budgetValue !== null && budgetValue < MIN_BUDGET) {
    errors.budget = `We don't take on projects under ${currency.symbol}${formatAmount(
      MIN_BUDGET,
      currency,
    )}`;
  }

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value };
}

export type AuditResult =
  | { ok: true; value: AuditPayload; url: URL }
  | { ok: false; errors: FieldErrors<"url" | "email"> };

export function validateAudit(input: unknown): AuditResult {
  const source = (input ?? {}) as Record<string, unknown>;

  const value: AuditPayload = {
    url: str(source.url, MAX.url),
    email: str(source.email, MAX.email),
    elapsedMs: num(source.elapsedMs),
    company_url: str(source.company_url, 200),
  };

  const errors: FieldErrors<"url" | "email"> = {};

  const url = normaliseUrl(value.url);
  if (!url) errors.url = "Enter a website address, for example yourcompany.com";
  if (!EMAIL_RE.test(value.email))
    errors.email = "We need a valid email to send the audit to";

  if (!url || Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { ...value, url: url.toString() }, url };
}
