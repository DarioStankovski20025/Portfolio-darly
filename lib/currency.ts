/**
 * Region → currency, resolved entirely in the browser.
 *
 * No IP lookup, no third-party geolocation service, no network request — the
 * visitor's IP never leaves their machine. The timezone and language the
 * browser already reports are enough to pick between €, $ and £, and it
 * resolves instantly so the field never flickers or shifts.
 */

export type Currency = {
  code: "EUR" | "USD" | "GBP";
  symbol: "€" | "$" | "£";
  /** Drives thousands grouping, so the symbol and separators always agree. */
  locale: string;
};

export const EUR: Currency = { code: "EUR", symbol: "€", locale: "de-DE" };
export const USD: Currency = { code: "USD", symbol: "$", locale: "en-US" };
export const GBP: Currency = { code: "GBP", symbol: "£", locale: "en-GB" };

/** Minimum project budget we take on. */
export const MIN_BUDGET = 1000;

/**
 * Memoised so the reference is stable — `useSyncExternalStore` requires
 * `getSnapshot` to return the same object between renders or React treats it
 * as a change and loops.
 */
let cached: Currency | null = null;

export function detectCurrency(): Currency {
  if (typeof window === "undefined") return EUR;
  if (cached) return cached;

  let zone = "";
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    zone = "";
  }

  if (zone === "Europe/London") return (cached = GBP);
  if (zone.startsWith("America/")) return (cached = USD);
  if (zone.startsWith("Europe/")) return (cached = EUR);

  // No usable timezone — fall back to the language tag's region.
  const language = typeof navigator !== "undefined" ? navigator.language : "";
  const region = language.split("-")[1]?.toUpperCase();
  if (region === "GB") return (cached = GBP);
  if (region === "US" || region === "CA") return (cached = USD);

  return (cached = EUR);
}

/** Stable no-op subscription — the region cannot change during a session. */
export const subscribeToCurrency = () => () => {};

/** "25000" → "25.000" (de-DE) or "25,000" (en-US). */
export function formatAmount(value: number, currency: Currency) {
  return new Intl.NumberFormat(currency.locale, {
    maximumFractionDigits: 0,
  }).format(value);
}

/** Keeps only digits, so paste and stray separators are handled the same way. */
export function parseAmount(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  return Number.parseInt(digits, 10);
}
