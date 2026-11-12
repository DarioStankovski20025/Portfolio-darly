"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Globe, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { site } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { EMAIL_RE, normaliseUrl } from "@/lib/validation";

type Fields = { url: string; name: string; email: string; notes: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: Fields = { url: "", name: "", email: "", notes: "" };

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!normaliseUrl(f.url)) e.url = "Enter your store link, for example yourstore.com";
  if (!f.name.trim()) e.name = "Tell us who to address the audit to";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "We need a valid email to send the audit to";
  return e;
}

/**
 * Store audit request: link, name, email, optional notes → /api/audit, which
 * emails the request to the Darly inbox. On success the form is replaced by a
 * confirmation that names the store and the address the audit goes to.
 */
export function StoreAuditForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [trap, setTrap] = useState("");
  const [sent, setSent] = useState<{ host: string; email: string; name: string } | null>(null);
  const mountedAt = useRef(0);
  const card = useRef<HTMLDivElement>(null);
  const successTitle = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => { mountedAt.current = Date.now(); }, []);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setF((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const found = validate(f);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = (["url", "name", "email"] as const).find((k) => found[k]);
      if (first) document.getElementById(`sa-${first}`)?.focus();
      return;
    }

    setStatus("sending");
    setServerError(null);
    const url = normaliseUrl(f.url)!;

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.toString(),
          name: f.name.trim(),
          email: f.email.trim(),
          notes: f.notes.trim(),
          elapsedMs: Date.now() - mountedAt.current,
          company_url: trap,
        }),
      });
      const json = await res.json().catch(() => null);

      if (res.ok && json?.ok === true) {
        setSent({ host: url.hostname.replace(/^www\./, ""), email: f.email.trim(), name: f.name.trim().split(/\s+/)[0] });
        setStatus("sent");
        track("audit_request", { store: url.hostname });
        requestAnimationFrame(() => card.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }));
        return;
      }
      if (res.status === 400 && json?.errors) {
        setErrors(json.errors);
        setStatus("idle");
        return;
      }
      setStatus("error");
      setServerError(json?.message ?? "Something went wrong on our end.");
    } catch {
      setStatus("error");
      setServerError("We couldn’t reach the server. Check your connection and try again.");
    }
  };

  const sending = status === "sending";
  const enter = reduced ? { opacity: 0 } : { opacity: 0, y: 14 };

  return (
    <div className="sa-card" ref={card}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" && sent ? (
          <motion.div key="sent" className="sa-success" onAnimationComplete={() => successTitle.current?.focus({ preventScroll: true })} initial={enter} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            <div className="sa-success-badge" aria-hidden="true">
              <motion.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}>
                <Check strokeWidth={2.4} />
              </motion.span>
              <i /><i />
            </div>
            <span className="sa-eyebrow">AUDIT REQUESTED</span>
            <h2 tabIndex={-1} ref={successTitle}>You’re all set, {sent.name}.</h2>
            <p>We’re going through <strong>{sent.host}</strong> now. Your audit will land in <strong>{sent.email}</strong> within two working days.</p>

            <ol className="sa-steps">
              <li className="done"><span><Check strokeWidth={2.4} /></span><div><b>Request received</b><small>Just now</small></div></li>
              <li className="active"><span>02</span><div><b>Manual review</b><small>We test your store on desktop and mobile</small></div></li>
              <li><span>03</span><div><b>Audit in your inbox</b><small>Clear, prioritised fixes — check spam just in case</small></div></li>
            </ol>

            <div className="sa-success-actions">
              <Link href="/contact" className="sa-btn">Book a call to go through it <ArrowUpRight aria-hidden="true" /></Link>
              <button type="button" className="sa-link" onClick={() => { setF(EMPTY); setSent(null); setStatus("idle"); }}>Audit another store</button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" noValidate onSubmit={onSubmit} initial={enter} animate={{ opacity: 1, y: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }} aria-busy={sending}>
            <div className="sa-card-head">
              <span className="sa-eyebrow">REQUEST YOUR AUDIT</span>
              <h2>Where should we look?</h2>
            </div>

            <div className={"sa-field sa-url" + (errors.url ? " invalid" : "")}>
              <label htmlFor="sa-url">Store link</label>
              <div className="sa-input-wrap">
                <Globe aria-hidden="true" />
                <input id="sa-url" name="url" type="text" inputMode="url" autoComplete="url" autoCapitalize="none" spellCheck={false} placeholder="yourstore.com" value={f.url} onChange={set("url")} disabled={sending} aria-invalid={!!errors.url} aria-describedby={errors.url ? "sa-url-error" : undefined} />
              </div>
              {errors.url && <p id="sa-url-error" className="sa-error" role="alert">{errors.url}</p>}
            </div>

            <div className="sa-row">
              <div className={"sa-field" + (errors.name ? " invalid" : "")}>
                <label htmlFor="sa-name">Your name</label>
                <input id="sa-name" name="name" type="text" autoComplete="name" placeholder="Jane Smith" value={f.name} onChange={set("name")} disabled={sending} aria-invalid={!!errors.name} aria-describedby={errors.name ? "sa-name-error" : undefined} />
                {errors.name && <p id="sa-name-error" className="sa-error" role="alert">{errors.name}</p>}
              </div>
              <div className={"sa-field" + (errors.email ? " invalid" : "")}>
                <label htmlFor="sa-email">Email for the audit</label>
                <input id="sa-email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="you@yourstore.com" value={f.email} onChange={set("email")} disabled={sending} aria-invalid={!!errors.email} aria-describedby={errors.email ? "sa-email-error" : undefined} />
                {errors.email && <p id="sa-email-error" className="sa-error" role="alert">{errors.email}</p>}
              </div>
            </div>

            <div className="sa-field">
              <label htmlFor="sa-notes">Anything we should focus on? <span>Optional</span></label>
              <textarea id="sa-notes" name="notes" rows={3} maxLength={2000} placeholder="e.g. Lots of add-to-carts but few checkouts on mobile" value={f.notes} onChange={set("notes")} disabled={sending} />
            </div>

            {/* Honeypot — hidden from people, irresistible to bots. */}
            <div className="sa-hp" aria-hidden="true">
              <label htmlFor="sa-company-url">Company URL</label>
              <input id="sa-company-url" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </div>

            {serverError && (
              <p className="sa-server-error" role="alert">
                {serverError} You can also email us at <a href={`mailto:${site.email}`}>{site.email}</a>.
              </p>
            )}

            <button type="submit" className="sa-btn sa-submit" disabled={sending}>
              {sending ? <><Loader2 className="sa-spin" aria-hidden="true" /> Sending…</> : <>Send me the free audit <ArrowRight aria-hidden="true" /></>}
            </button>
            <p className="sa-fine">No spam, no sales sequence. We only use your email to send the audit.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
