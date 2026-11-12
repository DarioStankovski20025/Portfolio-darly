"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";

import { CAL_EVENT_LINK } from "@/lib/booking";
import { track } from "@/lib/analytics";

const NAMESPACE = "darly-intro";

/**
 * Inline Cal.com calendar for the 30-minute intro call.
 *
 * The embed script and iframe come from cal.com, so the panel shows a quiet
 * loading line until Cal reports `linkReady`. A service picked elsewhere on the
 * site (`/contact?service=…`) is passed through as the booking notes so the
 * call starts with that context.
 */
export function BookingCalendar({ service }: { service?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cal = await getCalApi({ namespace: NAMESPACE });
      if (cancelled) return;
      cal("ui", {
        theme: "light",
        layout: "month_view",
        hideEventTypeDetails: false,
        cssVarsPerTheme: {
          light: { "cal-brand": "#245cf5" },
          dark: { "cal-brand": "#78b9ff" },
        },
      });
      cal("on", { action: "linkReady", callback: () => setReady(true) });
      cal("on", {
        action: "bookingSuccessfulV2",
        callback: () => track("book_call", { method: "cal.com", event: "30min" }),
      });
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="booking-calendar">
      <p className="booking-calendar-loading" hidden={ready} aria-live="polite">LOADING AVAILABILITY…</p>
      <Cal
        namespace={NAMESPACE}
        calLink={CAL_EVENT_LINK}
        config={{
          layout: "month_view",
          theme: "light",
          ...(service ? { notes: `Interested in: ${service}` } : {}),
        }}
      />
    </div>
  );
}
