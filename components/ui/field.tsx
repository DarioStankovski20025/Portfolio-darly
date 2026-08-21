"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A form field: the label floats up on focus or fill, and a rule draws in
 * underneath it.
 *
 * Lifted out of `contact-form.tsx` unchanged so the audit modal can use the
 * same field without a hundred-line copy. Anything that renders an input on
 * this site should come through here — two divergent field treatments is how a
 * form starts looking like it was assembled from parts.
 */
export function Field({
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
  disabled,
  inputRef,
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
  inputMode?: "numeric" | "url" | "text" | "email";
  /** Currency symbol shown inside the field, e.g. "€". */
  prefix?: string;
  disabled?: boolean;
  /** So a dialog can put the caret here when it opens. */
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  const shared = {
    id,
    name: id,
    value,
    autoComplete,
    inputMode,
    disabled,
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
      disabled && "opacity-60",
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

      {multiline ? (
        <textarea {...shared} rows={4} />
      ) : (
        <input {...shared} ref={inputRef} type={type} />
      )}

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
