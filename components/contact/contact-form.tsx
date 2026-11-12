"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { Field } from "@/components/ui/field";
import { site } from "@/lib/content";
import {
  EUR,
  detectCurrency,
  formatAmount,
  parseAmount,
  subscribeToCurrency,
} from "@/lib/currency";
import { DUR, EASE } from "@/lib/motion";
import { NEEDS, validateContact, type ContactFields } from "@/lib/validation";

/**
 * Enquiry form.
 *
 * Posts to `/api/contact`, which sends the message over SMTP and awaits the
 * result before answering — so "sent" here means a mail server accepted it, not
 * that a request left the browser. Validation comes from `lib/validation.ts`,
 * the same module the route runs, so the two can't drift apart.
 *
 * The `mailto:` handoff that used to be the whole submit path survives only as
 * a fallback, and only after a send has genuinely failed. Offering it up front
 * would push people into their mail client for no reason; hiding it after a
 * failure would lose the message.
 */

const EMPTY: ContactFields = { name: "", email: "", company: "", budget: "", message: "" };

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm({initialService}: {initialService?: string}) {
  const [fields, setFields] = useState<ContactFields>(EMPTY);
  const [needs, setNeeds] = useState<string[]>(initialService && (NEEDS as readonly string[]).includes(initialService) ? [initialService] : []);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFields, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [trap, setTrap] = useState("");
  const reduced = useReducedMotion();

  // The server has no region to read, so it renders the EUR default and the
  // client swaps in the visitor's own on hydration — no effect, no cascading
  // render, no hydration mismatch.
  const currency = useSyncExternalStore(subscribeToCurrency, detectCurrency, () => EUR);

  // Stamped in an effect, not in the ref initialiser: an initialiser runs
  // during render, and calling `Date.now()` there is both impure and a
  // guaranteed hydration mismatch. Only ever read inside handlers.
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const setBudget = (raw: string) => {
    const amount = parseAmount(raw);
    setFields((f) => ({ ...f, budget: amount === null ? "" : formatAmount(amount, currency) }));
    if (errors.budget) setErrors((e) => ({ ...e, budget: undefined }));
  };

  const filled = useMemo(() => {
    const checks = [
      fields.name.trim().length > 1,
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email),
      needs.length > 0,
      fields.message.trim().length > 9,
    ];
    return checks.filter(Boolean).length / checks.length;
  }, [fields, needs]);

  const set = (key: keyof ContactFields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  /** The last-resort handoff, built once and used only after a real failure. */
  const mailtoHref = useMemo(() => {
    const body = [
      `Name: ${fields.name}`,
      `Company: ${fields.company || "—"}`,
      `Budget: ${fields.budget ? `${currency.symbol}${fields.budget}` : "—"}`,
      `Looking for: ${needs.join(", ") || "—"}`,
      "",
      fields.message,
    ].join("\n");

    return `mailto:${site.email}?subject=${encodeURIComponent(
      `New project enquiry — ${fields.company || fields.name}`,
    )}&body=${encodeURIComponent(body)}`;
  }, [fields, needs, currency]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;

    const payload = {
      ...fields,
      budgetCurrency: currency.code,
      needs,
      elapsedMs: Date.now() - mountedAt.current,
      company_url: trap,
    };

    // The same function the route runs. If it passes here it passes there,
    // barring a hand-crafted request.
    const check = validateContact(payload);
    if (!check.ok) {
      setErrors(check.errors);
      return;
    }

    setStatus("sending");
    setServerError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json().catch(() => null);

      // Strict. Anything that is not an explicit success falls through to the
      // error branch — a network hiccup must never read as "message sent".
      if (response.ok && json?.ok === true) {
        setStatus("sent");
        return;
      }

      if (response.status === 400 && json?.errors) {
        setErrors(json.errors);
        setStatus("idle");
        return;
      }

      setStatus("error");
      setServerError(json?.message ?? "Something went wrong on our end.");
    } catch {
      setStatus("error");
      setServerError("We couldn't reach the server. Check your connection.");
    }
  };

  const reset = () => {
    setFields(EMPTY);
    setNeeds([]);
    setErrors({});
    setServerError(null);
    setStatus("idle");
    mountedAt.current = Date.now();
  };

  const sending = status === "sending";

  return (
    <div className="relative overflow-hidden rounded-[10px] border border-[var(--hairline)] bg-[var(--surface)] shadow-[0_50px_110px_-70px_rgba(7,11,15,0.45)]">
      {/* completion rail */}
      <div className="h-[3px] w-full bg-[var(--hairline)]">
        <motion.div
          className="h-full origin-left bg-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: filled }}
          transition={{ duration: DUR.base, ease: EASE }}
          style={{ width: "100%" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="sent"
            className="flex min-h-[420px] flex-col items-start justify-center gap-5 p-[clamp(1.5rem,3vw,3rem)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.base, ease: EASE }}
          >
            <motion.span
              className="flex size-14 items-center justify-center rounded-full bg-accent text-white"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: DUR.base, ease: EASE }}
            >
              <Check className="size-6" strokeWidth={2} />
            </motion.span>

            <h3 className="t-h3">Message sent.</h3>
            <p className="t-body max-w-[46ch]">
              It&apos;s with us. We reply within two working days — if you don&apos;t
              hear back, write to{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-medium text-[var(--accent-contextual)] underline underline-offset-4"
              >
                {site.email}
              </a>
              .
            </p>

            <button
              type="button"
              onClick={reset}
              className="t-label-sm mt-2 text-[var(--muted-fg)] underline underline-offset-4 transition-colors hover:text-[var(--accent-contextual)]"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            className="flex flex-col gap-[clamp(1.25rem,2vw,1.75rem)] p-[clamp(1.5rem,3vw,3rem)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.base, ease: EASE }}
          >
            {/*
              Honeypot. Named `company_url` rather than `website` or `phone`
              because browsers and password managers autofill those, which would
              turn the trap into a silent black hole for real people. Positioned
              off-screen rather than `display:none` — some bots skip fields that
              never render.
            */}
            <input
              type="text"
              name="company_url"
              value={trap}
              onChange={(e) => setTrap(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute left-[-9999px] top-0 h-0 w-0 opacity-0"
            />

            <div className="grid gap-[clamp(1.25rem,2vw,1.75rem)] sm:grid-cols-2">
              <Field
                id="name"
                label="Your name"
                value={fields.name}
                onChange={(v) => set("name", v)}
                error={errors.name}
                autoComplete="name"
                disabled={sending}
              />
              <Field
                id="email"
                label="Business email"
                type="email"
                value={fields.email}
                onChange={(v) => set("email", v)}
                error={errors.email}
                autoComplete="email"
                disabled={sending}
              />
              <Field
                id="company"
                label="Company"
                optional
                value={fields.company}
                onChange={(v) => set("company", v)}
                autoComplete="organization"
                disabled={sending}
              />
              <Field
                id="budget"
                label="Budget"
                optional
                inputMode="numeric"
                prefix={currency.symbol}
                value={fields.budget}
                onChange={setBudget}
                error={errors.budget}
                disabled={sending}
              />
            </div>

            {/* what they need */}
            <fieldset disabled={sending}>
              <legend className="t-label-sm text-[var(--muted-fg)]">
                Service interested in
              </legend>
              <label htmlFor="project-service" className="sr-only">Service interested in</label>
              <select id="project-service" value={needs[0] ?? ""} onChange={event => setNeeds(event.target.value ? [event.target.value] : [])} className="mt-4 min-h-12 w-full rounded-sm border border-slate-300 bg-slate-50 px-4 text-sm text-slate-800 focus:outline-2 focus:outline-blue-600">
                <option value="">Select a service (optional)</option>
                {NEEDS.map(need => <option value={need} key={need}>{need}</option>)}
              </select>
            </fieldset>

            <Field
              id="message"
              label="What problem are you trying to solve?"
              value={fields.message}
              onChange={(v) => set("message", v)}
              error={errors.message}
              multiline
              disabled={sending}
            />

            <AnimatePresence>
              {status === "error" && serverError && (
                <motion.div
                  role="alert"
                  className="rounded-[3px] border border-danger/40 bg-danger/5 px-4 py-3"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <p className="t-label-sm text-danger">{serverError}</p>
                  <p className="t-body mt-1.5 text-[0.875rem]">
                    Press send to try again — or, if it keeps failing,{" "}
                    <a
                      href={mailtoHref}
                      className="font-medium text-[var(--accent-contextual)] underline underline-offset-4"
                    >
                      send it by email instead
                    </a>
                    .
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-5 border-t border-[var(--hairline)] pt-6">
              <p className="t-label-sm text-[var(--muted-fg)]">
                We reply within two working days.
              </p>

              <button
                type="submit"
                data-cursor="start"
                disabled={sending}
                aria-busy={sending}
                // The width is pinned so swapping the label for "Sending" does
                // not resize the button mid-submit.
                className="group relative flex min-h-12 min-w-[11.5rem] items-center justify-center gap-3 overflow-hidden rounded-[3px] bg-ink px-7 py-3.5 text-[0.9375rem] font-medium text-paper transition-colors duration-300 hover:text-white disabled:cursor-default"
              >
                {!sending && (
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-accent transition-transform duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                  />
                )}

                <AnimatePresence mode="wait" initial={false}>
                  {sending ? (
                    <motion.span
                      key="sending"
                      className="flex items-center gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Sending
                      {reduced ? (
                        <span aria-hidden>…</span>
                      ) : (
                        <span aria-hidden className="flex gap-0.5">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{ opacity: [0.25, 1, 0.25] }}
                              transition={{
                                duration: 0.9,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut",
                              }}
                            >
                              .
                            </motion.span>
                          ))}
                        </span>
                      )}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="send"
                      className="flex items-center gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Send enquiry
                      <ArrowUpRight
                        className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        strokeWidth={1.75}
                      />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
