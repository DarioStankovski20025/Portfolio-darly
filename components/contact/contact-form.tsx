"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";

import { site } from "@/lib/content";
import {
  EUR,
  MIN_BUDGET,
  detectCurrency,
  formatAmount,
  parseAmount,
  subscribeToCurrency,
} from "@/lib/currency";
import { DUR, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Enquiry form.
 *
 * NO BACKEND IS CONNECTED. Submitting does not send anything anywhere — the
 * form validates, then hands the visitor a prefilled mailto so the message
 * still reaches Darly. Point `onSubmit` at a real endpoint (or a server action)
 * and delete the mailto fallback when one exists. Pretending to have sent a
 * message that vanished would be the worst possible first impression.
 */

const NEEDS = [
  "AI product",
  "Web application",
  "SaaS platform",
  "Website",
  "Custom software",
  "Automation",
];

type Fields = {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
};

const EMPTY: Fields = { name: "", email: "", company: "", budget: "", message: "" };

export function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [needs, setNeeds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sent, setSent] = useState(false);
  // The server has no region to read, so it renders the EUR default and the
  // client swaps in the visitor's own on hydration — no effect, no cascading
  // render, no hydration mismatch.
  const currency = useSyncExternalStore(subscribeToCurrency, detectCurrency, () => EUR);

  const budgetValue = parseAmount(fields.budget);
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

  const set = (key: keyof Fields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleNeed = (need: string) =>
    setNeeds((current) =>
      current.includes(need) ? current.filter((n) => n !== need) : [...current, need],
    );

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const next: Partial<Record<keyof Fields, string>> = {};
    if (fields.name.trim().length < 2) next.name = "Tell us who you are";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      next.email = "We need a valid email to reply";
    if (fields.message.trim().length < 10)
      next.message = "A sentence or two about the project is plenty";
    // Below this we are not the right team, and saying so up front is kinder
    // than a reply two days later.
    if (budgetValue !== null && budgetValue < MIN_BUDGET)
      next.budget = `We don't take on projects under ${currency.symbol}${formatAmount(MIN_BUDGET, currency)}`;

    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    // No endpoint yet — hand the message to the visitor's mail client rather
    // than swallowing it.
    const body = [
      `Name: ${fields.name}`,
      `Company: ${fields.company || "—"}`,
      `Budget: ${fields.budget ? `${currency.symbol}${fields.budget}` : "—"}`,
      `Looking for: ${needs.join(", ") || "—"}`,
      "",
      fields.message,
    ].join("\n");

    const href = `mailto:${site.email}?subject=${encodeURIComponent(
      `New project enquiry — ${fields.company || fields.name}`,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
    window.location.href = href;
  };

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
        {sent ? (
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

            <h3 className="t-h3">Your message is ready to send.</h3>
            <p className="t-body max-w-[46ch]">
              We&apos;ve opened your email client with the details filled in — send it
              and it reaches us directly. If nothing opened, write to{" "}
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
              onClick={() => setSent(false)}
              className="t-label-sm mt-2 text-[var(--muted-fg)] underline underline-offset-4 transition-colors hover:text-[var(--accent-contextual)]"
            >
              Edit the message
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
            <div className="grid gap-[clamp(1.25rem,2vw,1.75rem)] sm:grid-cols-2">
              <Field
                id="name"
                label="Your name"
                value={fields.name}
                onChange={(v) => set("name", v)}
                error={errors.name}
                autoComplete="name"
              />
              <Field
                id="email"
                label="Email"
                type="email"
                value={fields.email}
                onChange={(v) => set("email", v)}
                error={errors.email}
                autoComplete="email"
              />
              <Field
                id="company"
                label="Company"
                optional
                value={fields.company}
                onChange={(v) => set("company", v)}
                autoComplete="organization"
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
              />
            </div>

            {/* what they need */}
            <fieldset>
              <legend className="t-label-sm text-[var(--muted-fg)]">
                What do you need? <span className="text-[var(--accent-contextual)]">Select any</span>
              </legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {NEEDS.map((need) => {
                  const on = needs.includes(need);
                  return (
                    <button
                      key={need}
                      type="button"
                      onClick={() => toggleNeed(need)}
                      aria-pressed={on}
                      className={cn(
                        // The colour sits on the button itself. The previous
                        // `-z-10` fill span painted behind an opaque ancestor,
                        // which is why selection was invisible.
                        "flex items-center gap-2 rounded-[3px] border px-4 py-2.5 text-[0.875rem] font-medium tracking-[-0.01em] transition-colors duration-200",
                        on
                          ? "border-ink bg-ink text-paper"
                          : "border-[var(--hairline-strong)] text-[var(--muted-fg)] hover:border-[var(--on-surface)] hover:text-[var(--on-surface)]",
                      )}
                    >
                      <Check
                        aria-hidden
                        className={cn(
                          "size-3.5 transition-all duration-200",
                          on ? "scale-100 opacity-100" : "w-0 scale-50 opacity-0",
                        )}
                        strokeWidth={2.5}
                      />
                      {need}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <Field
              id="message"
              label="What are you building?"
              value={fields.message}
              onChange={(v) => set("message", v)}
              error={errors.message}
              multiline
            />

            <div className="flex flex-wrap items-center justify-between gap-5 border-t border-[var(--hairline)] pt-6">
              <p className="t-label-sm text-[var(--muted-fg)]">
                We reply within two working days.
              </p>

              <button
                type="submit"
                data-cursor="start"
                className="group relative flex min-h-12 items-center gap-3 overflow-hidden rounded-[3px] bg-ink px-7 py-3.5 text-[0.9375rem] font-medium text-paper transition-colors duration-300 hover:text-white"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-accent transition-transform duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                />
                Send enquiry
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.75}
                />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------
   Fields — label floats, underline draws in on focus
------------------------------------------------------------------ */

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  multiline,
  optional,
  autoComplete,
  inputMode,
  prefix,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  multiline?: boolean;
  optional?: boolean;
  autoComplete?: string;
  inputMode?: "numeric" | "url" | "text";
  /** Currency symbol shown inside the field, e.g. "€". */
  prefix?: string;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  const shared = {
    id,
    name: id,
    value,
    autoComplete,
    inputMode,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    className: cn(
      "peer w-full bg-transparent pb-3 pt-7 text-[clamp(1rem,1.2vw,1.125rem)] tracking-[-0.01em] outline-none",
      multiline && "min-h-[132px] resize-y",
      prefix && "pl-[1.35em]",
    ),
  };

  return (
    <div className={cn("relative", multiline && "sm:col-span-2")}>
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-0 origin-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          active
            ? "top-0 text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--muted-fg)]"
            : "top-6 text-[clamp(1rem,1.2vw,1.125rem)] text-[var(--muted-fg)]",
          !active && prefix && "left-[1.35em]",
        )}
        style={{ fontFamily: active ? "var(--font-mono)" : undefined }}
      >
        {label}
        {optional && <span className="ml-2 normal-case opacity-60">optional</span>}
      </label>

      {prefix && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-3 left-0 text-[clamp(1rem,1.2vw,1.125rem)] transition-colors duration-300",
            value ? "text-[var(--on-surface)]" : "text-[var(--muted-fg)]",
          )}
        >
          {prefix}
        </span>
      )}

      {multiline ? <textarea {...shared} rows={4} /> : <input {...shared} type={type} />}

      {/* the rule that draws in under the active field */}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-[var(--hairline-strong)]" />
      <motion.span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 h-[2px] origin-left",
          error ? "bg-danger" : "bg-accent",
        )}
        initial={false}
        animate={{ scaleX: focused || error ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
      />

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            className="t-label-sm mt-2.5 text-danger"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
