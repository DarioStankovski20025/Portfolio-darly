import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

/**
 * SMTP transport. Server only — the `server-only` import above makes it a build
 * error to reach this file from a `"use client"` graph, which is the guard that
 * keeps the mailbox password out of the browser bundle.
 *
 * Port 465 with implicit TLS by default. With 465 the handshake completes
 * before a single SMTP verb, so the credentials cannot go out in the clear
 * under any misconfiguration. On 587 you are relying on `secure: false` *plus*
 * the server advertising STARTTLS *plus* `requireTLS` — and if any of those
 * slips, nodemailer will happily `AUTH LOGIN` in plaintext. `SMTP_PORT` stays
 * an env var so 587 remains switchable without a code change.
 */

let transporter: Transporter | null = null;

function env(name: string): string {
  const value = process.env[name];
  // Names the variable, never the value — this message reaches logs.
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

/**
 * Lazy and memoised, deliberately not module scope.
 *
 * `createTransport()` at import time would run these env checks while Next
 * builds its module graph, so a machine without secrets would fail the whole
 * build rather than one request.
 */
function getTransport(): Transporter {
  if (transporter) return transporter;

  const port = Number(env("SMTP_PORT"));

  transporter = nodemailer.createTransport({
    host: env("SMTP_HOST"),
    port,
    secure: port === 465,
    auth: { user: env("SMTP_USER"), pass: env("SMTP_PASS") },
    // A hung socket is how an ambiguous "did it send?" state gets created.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  return transporter;
}

/** Escapes the four characters that would otherwise eat the rest of a line. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Plain text is the source of truth; the HTML twin just makes Gmail pleasant. */
export function textToHtml(text: string): string {
  return `<div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;line-height:1.6;color:#07111f"><pre style="margin:0;white-space:pre-wrap;word-break:break-word">${escapeHtml(
    text,
  )}</pre></div>`;
}

/**
 * Errors worth one retry: a network-level hiccup between this process and
 * Hostinger, not a rejection of the mail itself. Retrying an auth failure or a
 * malformed address would just waste the visitor's wait — those are excluded.
 */
const TRANSIENT_CODES = new Set([
  "ETIMEDOUT",
  "ECONNRESET",
  "ECONNREFUSED",
  "ESOCKET",
  "EDNS",
  "EAI_AGAIN",
]);

function isTransient(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  return typeof code === "string" && TRANSIENT_CODES.has(code);
}

/**
 * Sends to the inbox and nowhere else.
 *
 * `from` must be the authenticated mailbox — Hostinger rejects a mismatched
 * envelope sender, and SPF/DMARC would fail even if it did not. The visitor's
 * address rides on `replyTo`, so hitting Reply in the client works.
 *
 * One retry on a transient network error, with a short pause. A single dropped
 * packet or a momentary DNS blip between this server and Hostinger otherwise
 * turns into "your message couldn't be sent" for something that would have
 * gone through half a second later. Anything else — bad credentials, a
 * rejected sender, a malformed address — fails immediately; retrying those
 * would just make the visitor wait longer for the same outcome.
 */
export async function sendToInbox(options: {
  subject: string;
  text: string;
  replyTo: string;
}): Promise<void> {
  const user = env("SMTP_USER");

  const message = {
    from: `"Darly site" <${user}>`,
    to: env("CONTACT_TO"),
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
    html: textToHtml(options.text),
  };

  try {
    await getTransport().sendMail(message);
  } catch (error) {
    if (!isTransient(error)) throw error;

    console.warn("[mail] transient send failure, retrying once", error);
    // A connection-level failure may mean the cached transport is holding a
    // socket in a bad state — rebuild it rather than reuse whatever broke.
    transporter = null;
    await new Promise((resolve) => setTimeout(resolve, 800));
    await getTransport().sendMail(message);
  }
}
