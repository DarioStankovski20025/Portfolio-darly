import { sendToInbox } from "@/lib/mail";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { MIN_ELAPSED_MS, validateContact } from "@/lib/validation";

/**
 * Project enquiries from the contact form.
 *
 * No `runtime` export: Node is already the default and the Edge runtime is
 * deprecated in this version of Next — the docs say to remove the export
 * outright rather than pin it to "nodejs".
 */

// The transport allows 10s to connect and 20s on the socket. Without a ceiling
// above that, a slow handshake gets truncated into an ambiguous response, which
// is exactly how a visitor ends up not knowing whether their message sent.
export const maxDuration = 15;

export async function POST(request: Request) {
  // A malformed body throws, and an uncaught throw here is a 500 that reads
  // like the mail server broke.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Honeypot, read from the raw body and checked before anything else.
  // Answer exactly as if it worked — telling a bot it was caught is how it
  // learns to leave the field alone next time. Checking this after validation
  // would hand a bot field-level feedback on its way to being ignored.
  if (typeof (body as { company_url?: unknown })?.company_url === "string" &&
      (body as { company_url: string }).company_url.trim()) {
    console.warn("[contact] honeypot tripped");
    return Response.json({ ok: true });
  }

  const result = validateContact(body);

  if (!result.ok) {
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const enquiry = result.value;

  // Visible 400, not a silent success. A genuinely fast human is plausible in a
  // way a filled honeypot is not, and silently eating a real message is the one
  // failure this whole endpoint exists to avoid.
  if (enquiry.elapsedMs < MIN_ELAPSED_MS) {
    return Response.json(
      {
        ok: false,
        error: "too_fast",
        message: "That was quick — give it another moment and send again.",
      },
      { status: 400 },
    );
  }

  if (!rateLimit(`contact:${clientKey(request)}`).ok) {
    return Response.json(
      {
        ok: false,
        error: "rate_limited",
        message: "A few messages already came through. Try again shortly.",
      },
      { status: 429 },
    );
  }

  const lines = [
    `Name:        ${enquiry.name}`,
    `Email:       ${enquiry.email}`,
    `Company:     ${enquiry.company || "—"}`,
    `Budget:      ${enquiry.budget ? `${enquiry.budget} ${enquiry.budgetCurrency}` : "—"}`,
    `Looking for: ${enquiry.needs.join(", ") || "—"}`,
    `Submitted:   ${new Date().toISOString()}`,
    "",
    "---",
    enquiry.message,
    "---",
    "",
    "Reply directly to this email to reach them.",
  ].join("\n");

  try {
    // Awaited before responding. No fire-and-forget — a failure after the
    // response has gone is a failure nobody can be told about.
    await sendToInbox({
      subject: `New enquiry — ${enquiry.company || enquiry.name}`,
      text: lines,
      replyTo: enquiry.email,
    });
  } catch (error) {
    // Nodemailer errors carry the host, the username and the auth mechanism.
    // They go to the server log and never to the browser.
    console.error("[contact] send failed", error);
    return Response.json(
      {
        ok: false,
        error: "send_failed",
        message: "Your message couldn't be sent just now.",
      },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
