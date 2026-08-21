"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { DUR, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A dialog.
 *
 * Portalled to `document.body`, and that is not about z-index. The audit panel
 * that opens this sits inside a `<section className="relative overflow-hidden">`
 * wrapped in a `Reveal` that animates `y` — and a transformed ancestor becomes
 * the containing block for `position: fixed` descendants. Rendered in place, the
 * dialog would be positioned against that section and then clipped by its
 * `overflow-hidden` into a strip halfway down the page. The portal removes the
 * whole class of bug and survives any future reshuffle of the section wrapper.
 *
 * `z-[170]`: above the cookie card (160), because a consent toast must never
 * cover a dialog; below the intro curtain (200), which has to cover everything.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Whether we are past hydration. Stable references — the value never changes. */
const subscribeNever = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function Modal({
  open,
  onClose,
  labelledBy,
  describedBy,
  dismissible = true,
  initialFocusRef,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** id of the heading rendered inside `children`. */
  labelledBy: string;
  describedBy?: string;
  /** false while a request is in flight, so a send can't be orphaned. */
  dismissible?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  className?: string;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  // `document` doesn't exist while this renders on the server, and rendering
  // the tree inline then portalling on the client is a hydration mismatch. The
  // same `useSyncExternalStore` shape the contact form uses for currency: false
  // on the server, true once hydrated, no effect and no cascading render.
  const mounted = useSyncExternalStore(subscribeNever, onClient, onServer);

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;
    lockScroll();

    const frame = window.setTimeout(() => {
      (initialFocusRef?.current ?? panelRef.current)?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dismissible) {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      // Re-queried every keystroke so the trap follows the dialog's own
      // idle → sending → sent content swap.
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(frame);
      document.removeEventListener("keydown", onKeyDown);
      unlockScroll();
      restoreTo.current?.focus();
    };
  }, [open, dismissible, onClose, initialFocusRef]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop is a sibling of the panel, not its parent — no
              stopPropagation needed on the panel to keep clicks from closing. */}
          <motion.div
            aria-hidden
            data-native-cursor
            onClick={() => dismissible && onClose()}
            className="fixed inset-0 z-[170] bg-ink/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : DUR.fast, ease: EASE }}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            tabIndex={-1}
            data-native-cursor
            className={cn(
              "fixed inset-x-0 bottom-0 z-[170] max-h-[85svh] overflow-y-auto rounded-t-[14px] border border-[var(--hairline)] bg-[var(--surface)] p-[clamp(1.25rem,3vw,2rem)] pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_50px_110px_-70px_rgba(7,11,15,0.45)] outline-none",
              // Bottom sheet on a phone, centred card from `sm` up. The
              // max-height plus scroll is load-bearing on iOS, where the
              // software keyboard halves the viewport when the input focuses.
              "sm:inset-0 sm:m-auto sm:h-fit sm:w-[min(30rem,calc(100vw-3rem))] sm:rounded-[10px] sm:pb-[clamp(1.25rem,3vw,2rem)]",
              className,
            )}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: reduced ? 0.15 : DUR.base, ease: EASE }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
