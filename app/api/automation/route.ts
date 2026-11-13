import { sendToInbox } from "@/lib/mail";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { MIN_ELAPSED_MS, validateAutomation } from "@/lib/validation";

/**
 * Automation assessment requests from /automation: business details plus a
 * description of the manual work, emailed to the Darly inbox. Same guards as
 * /api/audit — honeypot, time floor, rate limit, shared validation.
 */

export const maxDuration = 15;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const trap = (body as { company_url?: unknown })?.company_url;
  if (typeof trap === "string" && trap.trim()) {
    console.warn("[automation] honeypot tripped");
    return Response.json({ ok: true });
  }

  const result = validateAutomation(body);
  if (!result.ok) {
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const { value: req, website, businessLabel } = result;

  if (req.elapsedMs < MIN_ELAPSED_MS) {
    return Response.json(
      { ok: false, error: "too_fast", message: "That was quick — give it another moment and send again." },
      { status: 400 },
    );
  }

  if (!rateLimit(`automation:${clientKey(request)}`).ok) {
    return Response.json(
      { ok: false, error: "rate_limited", message: "A few requests already came through. Try again shortly." },
      { status: 429 },
    );
  }

  const lines = [
    `Name:          ${req.name}`,
    `Email:         ${req.email}`,
    `Website:       ${website ? website.toString() : "—"}`,
    `Business type: ${businessLabel}`,
    `Location:      ${req.city}, ${req.country}`,
    `Submitted:     ${new Date().toISOString()}`,
    "",
    "What they do manually today:",
    req.manualWork,
    ...(req.tools ? ["", "Tools they use:", req.tools] : []),
    "",
    "Reply directly to this email to reach them.",
  ].join("\n");

  try {
    await sendToInbox({
      subject: `Automation request — ${businessLabel} · ${req.city} (${req.name})`,
      text: lines,
      replyTo: req.email,
    });
  } catch (error) {
    console.error("[automation] send failed", error);
    return Response.json(
      { ok: false, error: "send_failed", message: "Your request couldn't be sent just now." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
