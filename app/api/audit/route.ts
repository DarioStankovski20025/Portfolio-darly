import { sendToInbox } from "@/lib/mail";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { MIN_ELAPSED_MS, validateAudit } from "@/lib/validation";

/**
 * Website audit requests: a URL and somewhere to send the findings.
 *
 * Separate from /api/contact rather than one endpoint with a `kind` field —
 * the two payloads share no fields and no validation, and the only real reuse
 * (the transport, the validators) already lives in lib/.
 *
 * No `runtime` export: Node is the default and Edge is deprecated.
 */

export const maxDuration = 15;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  if (typeof (body as { company_url?: unknown })?.company_url === "string" &&
      (body as { company_url: string }).company_url.trim()) {
    console.warn("[audit] honeypot tripped");
    return Response.json({ ok: true });
  }

  const result = validateAudit(body);

  if (!result.ok) {
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const { value: audit, url } = result;

  if (audit.elapsedMs < MIN_ELAPSED_MS) {
    return Response.json(
      {
        ok: false,
        error: "too_fast",
        message: "That was quick — give it another moment and send again.",
      },
      { status: 400 },
    );
  }

  if (!rateLimit(`audit:${clientKey(request)}`).ok) {
    return Response.json(
      {
        ok: false,
        error: "rate_limited",
        message: "A few requests already came through. Try again shortly.",
      },
      { status: 429 },
    );
  }

  const lines = [
    `Website:   ${url.toString()}`,
    `Hostname:  ${url.hostname}`,
    `Email:     ${audit.email}`,
    `Submitted: ${new Date().toISOString()}`,
    "",
    "Reply directly to this email to reach them.",
  ].join("\n");

  try {
    await sendToInbox({
      subject: `Audit request — ${url.hostname}`,
      text: lines,
      replyTo: audit.email,
    });
  } catch (error) {
    console.error("[audit] send failed", error);
    return Response.json(
      {
        ok: false,
        error: "send_failed",
        message: "Your request couldn't be sent just now.",
      },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
