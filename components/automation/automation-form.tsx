"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Globe, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { site } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { BUSINESS_TYPES, validateAutomation, type AutomationFields } from "@/lib/validation";

type Errors = Partial<Record<keyof AutomationFields, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: AutomationFields = {
  name: "", email: "", website: "", businessType: "", businessTypeOther: "",
  country: "", city: "", manualWork: "", tools: "",
};

/** Order the first error is focused in — matches the order on screen. */
const ORDER: (keyof AutomationFields)[] = ["name", "email", "website", "businessType", "businessTypeOther", "country", "city", "manualWork"];

function TextField(props: {
  id: keyof AutomationFields;
  label: string;
  value: string;
  error?: string;
  optional?: boolean;
  disabled?: boolean;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  multiline?: boolean;
  hint?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "value" | "onChange">) {
  const { id, label, value, error, optional, disabled, onChange, icon, multiline, hint, ...rest } = props;
  const domId = `au-${id}`;
  const describedBy = [error && `${domId}-error`, hint && `${domId}-hint`].filter(Boolean).join(" ") || undefined;
  const common = {
    id: domId, name: id, value, disabled,
    "aria-invalid": !!error, "aria-describedby": describedBy,
    placeholder: rest.placeholder,
  };
  return (
    <div className={"sa-field" + (error ? " invalid" : "")}>
      <label htmlFor={domId}>{label}{optional && <span>Optional</span>}</label>
      {multiline ? (
        <textarea {...common} rows={5} maxLength={5000} onChange={(e) => onChange(e.target.value)} />
      ) : icon ? (
        <div className="sa-input-wrap au-icon">{icon}<input {...rest} {...common} onChange={(e) => onChange(e.target.value)} /></div>
      ) : (
        <input {...rest} {...common} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && !error && <p id={`${domId}-hint`} className="au-hint">{hint}</p>}
      {error && <p id={`${domId}-error`} className="sa-error" role="alert">{error}</p>}
    </div>
  );
}

/**
 * Automation assessment request → /api/automation → Darly inbox. Validation
 * is the same function the route runs (lib/validation.ts).
 */
export function AutomationForm() {
  const [f, setF] = useState<AutomationFields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [trap, setTrap] = useState("");
  const [sent, setSent] = useState<{ name: string; email: string; business: string } | null>(null);
  const mountedAt = useRef(0);
  const card = useRef<HTMLDivElement>(null);
  const successTitle = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => { mountedAt.current = Date.now(); }, []);

  const set = (key: keyof AutomationFields) => (value: string) => {
    setF((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const pickType = (type: string) => {
    set("businessType")(type);
    if (type === "Other") requestAnimationFrame(() => document.getElementById("au-businessTypeOther")?.focus());
  };

  const focusFirst = (found: Errors) => {
    const first = ORDER.find((k) => found[k]);
    if (!first) return;
    const el = first === "businessType"
      ? document.querySelector<HTMLElement>(".au-chips button")
      : document.getElementById(`au-${first}`);
    el?.focus();
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const check = validateAutomation(f);
    if (!check.ok) {
      setErrors(check.errors);
      focusFirst(check.errors);
      return;
    }
    setErrors({});
    setStatus("sending");
    setServerError(null);

    try {
      const res = await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, elapsedMs: Date.now() - mountedAt.current, company_url: trap }),
      });
      const json = await res.json().catch(() => null);

      if (res.ok && json?.ok === true) {
        setSent({ name: f.name.trim().split(/\s+/)[0], email: f.email.trim(), business: check.businessLabel });
        setStatus("sent");
        track("automation_request", { business_type: check.businessLabel, country: f.country.trim() });
        return;
      }
      if (res.status === 400 && json?.errors) {
        setErrors(json.errors);
        focusFirst(json.errors);
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
  const types = [...BUSINESS_TYPES, "Other"];

  return (
    <div className="sa-card" ref={card}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" && sent ? (
          <motion.div key="sent" className="sa-success" onAnimationStart={() => card.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })} onAnimationComplete={() => successTitle.current?.focus({ preventScroll: true })} initial={enter} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            <div className="sa-success-badge" aria-hidden="true">
              <motion.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}>
                <Check strokeWidth={2.4} />
              </motion.span>
              <i /><i />
            </div>
            <span className="sa-eyebrow">REQUEST RECEIVED</span>
            <h2 tabIndex={-1} ref={successTitle}>Thanks, {sent.name}. We’re on it.</h2>
            <p>We’ll map out what can be automated for your <strong>{sent.business.toLowerCase()}</strong> business and send a short, practical plan to <strong>{sent.email}</strong> within two working days.</p>

            <ol className="sa-steps">
              <li className="done"><span><Check strokeWidth={2.4} /></span><div><b>Details received</b><small>Just now</small></div></li>
              <li className="active"><span>02</span><div><b>We map your workflows</b><small>Spotting the repetitive work worth automating first</small></div></li>
              <li><span>03</span><div><b>Automation plan in your inbox</b><small>What to automate, the tools, and the time it saves — check spam just in case</small></div></li>
            </ol>

            <div className="sa-success-actions">
              <Link href="/contact" className="sa-btn">Book a call to talk it through <ArrowUpRight aria-hidden="true" /></Link>
              <button type="button" className="sa-link" onClick={() => { setF(EMPTY); setSent(null); setStatus("idle"); }}>Send another request</button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" noValidate onSubmit={onSubmit} initial={enter} animate={{ opacity: 1, y: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }} aria-busy={sending}>
            <div className="sa-card-head">
              <span className="sa-eyebrow">YOUR FREE AUTOMATION PLAN</span>
              <h2>Tell us how your business runs.</h2>
            </div>

            <fieldset className="au-group" disabled={sending}>
              <legend><b>01</b> About you</legend>
              <div className="sa-row">
                <TextField id="name" label="Your name" value={f.name} error={errors.name} onChange={set("name")} autoComplete="name" placeholder="Jane Smith" />
                <TextField id="email" label="Email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} value={f.email} error={errors.email} onChange={set("email")} placeholder="you@company.com" />
              </div>
              <TextField id="website" label="Website" optional icon={<Globe aria-hidden="true" />} inputMode="url" autoComplete="url" autoCapitalize="none" spellCheck={false} value={f.website} error={errors.website} onChange={set("website")} placeholder="yourcompany.com" />
            </fieldset>

            <fieldset className="au-group" disabled={sending}>
              <legend><b>02</b> Your business</legend>
              <div className={"sa-field" + (errors.businessType ? " invalid" : "")}>
                <span className="au-label" id="au-type-label">Business type</span>
                <div className="au-chips" role="radiogroup" aria-labelledby="au-type-label" aria-describedby={errors.businessType ? "au-businessType-error" : undefined}>
                  {types.map((t) => (
                    <button key={t} type="button" role="radio" aria-checked={f.businessType === t} className={f.businessType === t ? "on" : ""} onClick={() => pickType(t)}>
                      {f.businessType === t && <Check aria-hidden="true" />}{t}
                    </button>
                  ))}
                </div>
                {errors.businessType && <p id="au-businessType-error" className="sa-error" role="alert">{errors.businessType}</p>}
              </div>
              <AnimatePresence initial={false}>
                {f.businessType === "Other" && (
                  <motion.div key="other" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: EASE }} style={{ overflow: "hidden" }}>
                    <TextField id="businessTypeOther" label="What kind of business?" value={f.businessTypeOther} error={errors.businessTypeOther} onChange={set("businessTypeOther")} placeholder="e.g. Dental lab, wedding planner…" />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="sa-row">
                <TextField id="country" label="Country" icon={<MapPin aria-hidden="true" />} autoComplete="country-name" value={f.country} error={errors.country} onChange={set("country")} placeholder="e.g. Germany" />
                <TextField id="city" label="City" autoComplete="address-level2" value={f.city} error={errors.city} onChange={set("city")} placeholder="e.g. Berlin" />
              </div>
            </fieldset>

            <fieldset className="au-group" disabled={sending}>
              <legend><b>03</b> The manual work</legend>
              <TextField id="manualWork" multiline label="What do you or your team do by hand today?" value={f.manualWork} error={errors.manualWork} onChange={set("manualWork")}
                placeholder="e.g. We copy orders from email into a spreadsheet, send invoices one by one, and chase payments manually every Friday…"
                hint="The more detail the better: the task, how often, and roughly how long it takes." />
              <TextField id="tools" label="Tools you use" optional value={f.tools} onChange={set("tools")} placeholder="e.g. Gmail, Excel, Shopify, QuickBooks, WhatsApp" />
            </fieldset>

            {/* Honeypot — hidden from people, irresistible to bots. */}
            <div className="sa-hp" aria-hidden="true">
              <label htmlFor="au-company-url">Company URL</label>
              <input id="au-company-url" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </div>

            {serverError && (
              <p className="sa-server-error" role="alert">
                {serverError} You can also email us at <a href={`mailto:${site.email}`}>{site.email}</a>.
              </p>
            )}

            <button type="submit" className="sa-btn sa-submit" disabled={sending}>
              {sending ? <><Loader2 className="sa-spin" aria-hidden="true" /> Sending…</> : <>Get my automation plan <ArrowRight aria-hidden="true" /></>}
            </button>
            <p className="sa-fine">Free and no obligation. We only use your details to prepare your plan.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
