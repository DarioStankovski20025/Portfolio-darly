"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { useRef, useState } from "react";

import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { site } from "@/lib/content";
import { DUR, EASE } from "@/lib/motion";
import { EMAIL_RE } from "@/lib/validation";

/**
 * Where to send the audit.
 *
 * Opens once the diagnostic has finished running, never before — the
 * connecting/reading/analysing sequence is the only reason a stranger believes
 * the offer, and interrupting it with an email gate would be a bait-and-switch.
 *
 * Success deliberately does not auto-close. Dismissing the dialog the moment
 * the request lands steals the one confirmation the visitor gets.
 */
export function AuditRequestModal({
  open,
  onClose,
  url,
  elapsedMs,
}: {
  open: boolean;
  onClose: () => void;
  url: URL;
  /** Read at submit time — the audit section owns the clock. */
  elapsedMs: () => number;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [trap, setTrap] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();

  const sending = status === "sending";

  const close = () => {
    onClose();
    // Reset after the exit animation rather than during it, so the panel
    // doesn't visibly flip back to the form on its way out.
    window.setTimeout(() => {
      setEmail("");
      setError(undefined);
      setServerError(null);
      setStatus("idle");
    }, 300);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;

    if (!EMAIL_RE.test(email.trim())) {
      setError("We need a valid email to send the audit to");
      return;
    }

    setError(undefined);
    setServerError(null);
    setStatus("sending");

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.toString(),
          email: email.trim(),
          elapsedMs: elapsedMs(),
          company_url: trap,
        }),
      });
      const json = await response.json().catch(() => null);

      if (response.ok && json?.ok === true) {
        setStatus("sent");
        return;
      }

      if (response.status === 400 && json?.errors?.email) {
        setError(json.errors.email);
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

  const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent(
    `Website audit — ${url.hostname}`,
  )}&body=${encodeURIComponent(`Please audit ${url.toString()}`)}`;

  return (
    <Modal
      open={open}
      onClose={close}
      labelledBy="audit-modal-title"
      describedBy="audit-modal-body"
      // A half-sent request must not be orphaned by an accidental Escape.
      dismissible={!sending}
      initialFocusRef={emailRef}
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            className="flex flex-col items-start gap-4 py-2"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.base, ease: EASE }}
          >
            <motion.span
              className="flex size-12 items-center justify-center rounded-full bg-accent text-white"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: DUR.base, ease: EASE }}
            >
              <Check className="size-5" strokeWidth={2} />
            </motion.span>

            <h2 id="audit-modal-title" className="t-h3">
              On its way.
            </h2>
            <p className="t-body text-[0.9375rem]">
              We&apos;ll look at <strong className="font-medium text-[var(--on-surface)]">{url.hostname}</strong> and
              email the findings to {email.trim()} within two working days.
            </p>

            <button
              type="button"
              onClick={close}
              data-cursor="link"
              className="mt-2 rounded-[3px] bg-ink px-5 py-2.5 text-[0.875rem] font-medium text-paper transition-opacity duration-300 hover:opacity-85"
            >
              Close
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 id="audit-modal-title" className="t-h3">
              Where should we send it?
            </h2>
            <p id="audit-modal-body" className="t-body mt-2 text-[0.9375rem]">
              We&apos;ll run the audit on{" "}
              <strong className="font-medium text-[var(--on-surface)]">{url.hostname}</strong>{" "}
              and email the findings within two working days.
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-5">
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

              <Field
                id="audit-email"
                label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  if (error) setError(undefined);
                }}
                error={error}
                disabled={sending}
                inputRef={emailRef}
              />

              <AnimatePresence>
                {status === "error" && serverError && (
                  <motion.div
                    role="alert"
                    className="mt-4 rounded-[3px] border border-danger/40 bg-danger/5 px-3.5 py-2.5"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    <p className="t-label-sm text-danger">{serverError}</p>
                    <p className="t-body mt-1 text-[0.8125rem]">
                      Try again — or{" "}
                      <a
                        href={mailtoHref}
                        className="font-medium text-[var(--accent-contextual)] underline underline-offset-4"
                      >
                        send us the URL by email
                      </a>
                      .
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="submit"
                  data-cursor="start"
                  disabled={sending}
                  aria-busy={sending}
                  className="group relative flex min-h-11 min-w-[10rem] flex-1 items-center justify-center gap-2 overflow-hidden rounded-[3px] bg-ink px-5 py-3 text-[0.875rem] font-medium text-paper transition-colors duration-300 disabled:cursor-default sm:flex-none"
                >
                  {!sending && (
                    <span
                      aria-hidden
                      className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-accent transition-transform duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                    />
                  )}
                  {sending ? (
                    "Sending…"
                  ) : (
                    <>
                      Send my audit
                      <ArrowUpRight
                        className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        strokeWidth={1.75}
                      />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={close}
                  disabled={sending}
                  data-cursor="link"
                  className="t-label-sm px-2 py-2 text-[var(--muted-fg)] underline underline-offset-4 transition-colors hover:text-[var(--on-surface)] disabled:opacity-50"
                >
                  Not now
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
