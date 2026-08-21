"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AuditRequestModal } from "@/components/home/audit-request-modal";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TextReveal } from "@/components/ui/text-reveal";
import { auditChecks } from "@/lib/content";
import { DUR, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { normaliseUrl } from "@/lib/validation";

/**
 * Free website audit.
 *
 * Lead generation shaped like an instrument, not a newsletter box: the argument
 * sits on the left, and the right is a self-contained diagnostic panel with its
 * own chrome, input, and check readout.
 *
 * The connecting/reading/analysing sequence is presentation, not measurement —
 * nothing is fetched from the visitor's site. What it does do is capture a real
 * request: when the sequence finishes, a dialog asks where to send the findings
 * and posts the URL and address to `/api/audit`. The audit itself is then run by
 * a person, which is the only honest version of this until there is a service
 * behind it.
 */

const PHASES = [
  { key: "connecting", label: "Connecting" },
  { key: "reading", label: "Reading website" },
  { key: "analysing", label: "Analyzing experience" },
  { key: "ready", label: "Ready" },
] as const;

type Status = "idle" | "running" | "done";

export function WebsiteAudit() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [phase, setPhase] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  /** The validated URL the run is about — held so the dialog can name it. */
  const [target, setTarget] = useState<URL | null>(null);
  const timers = useRef<number[]>([]);
  const reduced = useReducedMotion();

  // Stamped in an effect: a ref initialiser runs during render, where
  // `Date.now()` is impure and would differ between server and client.
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "running") return;

    // Same normaliser the route runs, so anything accepted here is accepted
    // there.
    const url = normaliseUrl(value);
    if (!url) {
      setError("Enter a website address, for example yourcompany.com");
      return;
    }

    setError(null);
    setTarget(url);
    setStatus("running");
    setPhase(0);

    const step = reduced ? 120 : 850;
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = PHASES.slice(1).map((_, i) =>
      window.setTimeout(() => setPhase(i + 1), step * (i + 1)),
    );
    timers.current.push(
      window.setTimeout(() => {
        setStatus("done");
        // Asking for the address here rather than on submit: the sequence is
        // what earns the request, so it has to finish first. Reduced motion
        // runs the same path in 480ms.
        setModalOpen(true);
      }, step * PHASES.length),
    );
  };

  const reset = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    setStatus("idle");
    setPhase(-1);
  };

  const running = status !== "idle";

  return (
    <section
      id="audit"
      className="section-y relative overflow-hidden bg-[#eef2f8]"
      aria-labelledby="audit-heading"
    >
      <div className="shell">
        <div className="grid items-center gap-[clamp(2.5rem,4vw,4.5rem)] lg:grid-cols-12">
          {/* ---------------- the offer ---------------- */}
          <div className="lg:col-span-5">
            <SectionLabel className="mb-5">Free website audit</SectionLabel>

            <TextReveal
              as="h2"
              id="audit-heading"
              className="t-h2"
              lines={[
                [{ text: "See what's holding" }],
                [
                  { text: "your website " },
                  { text: "back", className: "editorial" },
                  { text: ".", className: "dot-accent" },
                ],
              ]}
            />

            <Reveal delay={0.06}>
              <p className="t-body mt-5 max-w-[46ch]">
                Enter your website and we&apos;ll analyze its design, UX,
                performance and opportunities for AI or automation.
              </p>

              <div className="mt-7 flex items-center gap-3">
                <span className="block size-[6px] rounded-full bg-accent" />
                <p className="t-label-sm text-[var(--muted-fg)]">
                  No sales call required. Free initial audit.
                </p>
              </div>
            </Reveal>
          </div>

          {/* ---------------- the instrument ---------------- */}
          <Reveal delay={0.08} y={22} className="lg:col-span-6 lg:col-start-7">
            <div className="overflow-hidden rounded-[8px] border border-[color-mix(in_oklab,#07111f_13%,transparent)] bg-white shadow-[0_40px_90px_-60px_rgba(7,11,15,0.4)]">
              {/* panel chrome */}
              <div className="flex items-center gap-2.5 border-b border-[color-mix(in_oklab,#07111f_9%,transparent)] bg-[#fbfdff] px-4 py-3">
                <span className="block size-[6px] rounded-full bg-accent" />
                <span className="t-label-sm text-[color-mix(in_oklab,#07111f_55%,transparent)]">
                  Site diagnostic
                </span>
                <span className="t-label-sm ml-auto text-[color-mix(in_oklab,#07111f_40%,transparent)]">
                  {running ? "Running" : "Idle"}
                </span>
              </div>

              {/* the field */}
              <form onSubmit={onSubmit} noValidate className="p-4 sm:p-5">
                <div
                  className={cn(
                    "group relative flex h-[64px] items-center gap-3 overflow-hidden rounded-[5px] border bg-[#f3f6fc] pl-4 pr-2 transition-colors duration-300 sm:h-[72px] sm:pl-5 sm:pr-2.5",
                    error
                      ? "border-accent"
                      : "border-[color-mix(in_oklab,#07111f_12%,transparent)] focus-within:border-accent focus-within:bg-white",
                  )}
                >
                  {/* a line sweeping the field while it waits */}
                  {!reduced && !running && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-y-0 w-px bg-accent/25"
                      animate={{ left: ["0%", "100%"] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                    />
                  )}

                  <span aria-hidden className="t-label-sm shrink-0 text-[var(--accent-contextual)]">
                    URL
                  </span>

                  <label htmlFor="audit-url" className="sr-only">
                    Your website address
                  </label>
                  <input
                    id="audit-url"
                    name="url"
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    spellCheck={false}
                    placeholder="yourwebsite.com"
                    value={value}
                    onChange={(event) => {
                      setValue(event.target.value);
                      if (error) setError(null);
                      // Not while the dialog is open — tearing down the run
                      // would pull the URL out from under it.
                      if (running && !modalOpen) reset();
                    }}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "audit-error" : undefined}
                    className="relative min-w-0 flex-1 bg-transparent text-[clamp(1rem,1.3vw,1.25rem)] tracking-[-0.01em] outline-none placeholder:text-[color-mix(in_oklab,#07111f_32%,transparent)]"
                  />

                  <button
                    type="submit"
                    data-cursor="start"
                    disabled={status === "running"}
                    className="group/btn relative flex h-[48px] shrink-0 items-center gap-2 overflow-hidden rounded-[4px] bg-ink px-4 text-[0.875rem] font-medium text-paper transition-colors duration-300 hover:bg-accent disabled:opacity-70 sm:h-[54px] sm:px-6"
                  >
                    <span className="hidden sm:inline">Analyze</span>
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                      strokeWidth={1.75}
                    />
                  </button>
                </div>

                {error && (
                  <p id="audit-error" role="alert" className="t-label-sm mt-3 text-[var(--accent-contextual)]">
                    {error}
                  </p>
                )}
              </form>

              {/* what gets checked — doubles as the live readout */}
              <div className="grid grid-cols-2 gap-px border-t border-[color-mix(in_oklab,#07111f_9%,transparent)] bg-[color-mix(in_oklab,#07111f_9%,transparent)] sm:grid-cols-3">
                {auditChecks.map((check, index) => {
                  const lit = running && phase >= 0 && index <= phase * 2;
                  return (
                    <div
                      key={check}
                      className={cn(
                        "flex items-center gap-2.5 bg-white px-4 py-3.5 transition-colors duration-300",
                        lit && "bg-[#f1f6fe]",
                      )}
                    >
                      <span
                        className={cn(
                          "block size-[6px] shrink-0 rounded-full transition-colors duration-300",
                          lit
                            ? "bg-accent"
                            : "bg-[color-mix(in_oklab,#07111f_18%,transparent)]",
                        )}
                      />
                      <span
                        className={cn(
                          "t-label-sm transition-colors duration-300",
                          lit
                            ? "text-[#07111f]"
                            : "text-[color-mix(in_oklab,#07111f_50%,transparent)]",
                        )}
                      >
                        {check}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* diagnostic states */}
              <AnimatePresence>
                {running && (
                  <motion.div
                    className="overflow-hidden border-t border-[color-mix(in_oklab,#07111f_9%,transparent)]"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: DUR.base, ease: EASE }}
                  >
                    <ol className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3.5 sm:px-5">
                      {PHASES.map((item, index) => {
                        const state =
                          index < phase ? "done" : index === phase ? "active" : "waiting";
                        return (
                          <li key={item.key} className="flex items-center gap-2">
                            <span
                              className={cn(
                                "block size-[6px] shrink-0 rounded-full transition-colors duration-300",
                                state === "waiting"
                                  ? "bg-[color-mix(in_oklab,#07111f_18%,transparent)]"
                                  : "bg-accent",
                              )}
                            />
                            <span
                              className={cn(
                                "t-label-sm transition-colors duration-300",
                                state === "waiting"
                                  ? "text-[color-mix(in_oklab,#07111f_45%,transparent)]"
                                  : "text-[#07111f]",
                              )}
                            >
                              {item.label}
                            </span>
                            {state === "active" && !reduced && (
                              <motion.span
                                className="block h-px w-8 origin-left bg-accent"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, ease: "linear" }}
                              />
                            )}
                          </li>
                        );
                      })}
                    </ol>

                    {status === "done" && (
                      <motion.div
                        className="border-t border-[color-mix(in_oklab,#07111f_9%,transparent)] bg-[#f1f6fe] px-4 py-4 sm:px-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: DUR.base, ease: EASE }}
                      >
                        <p className="text-[0.9375rem] font-medium tracking-[-0.01em]">
                          Analysis complete.
                        </p>
                        <p className="t-body mt-1.5 text-[0.875rem]">
                          Tell us where to send the findings and we&apos;ll have them
                          with you within two working days.
                        </p>
                        {/* The recovery path. Without it, dismissing the dialog
                            strands the visitor at a finished run with nothing
                            left to press. */}
                        <button
                          type="button"
                          onClick={() => setModalOpen(true)}
                          data-cursor="start"
                          className="mt-3 inline-flex items-center gap-2 rounded-[3px] bg-ink px-4 py-2.5 text-[0.875rem] font-medium text-paper transition-colors duration-300 hover:bg-accent"
                        >
                          Send me the audit
                          <ArrowUpRight className="size-4" strokeWidth={1.75} />
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>

      {target && (
        <AuditRequestModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          url={target}
          elapsedMs={() => Date.now() - mountedAt.current}
        />
      )}
    </section>
  );
}
