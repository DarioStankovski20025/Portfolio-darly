import { Shell } from "@/components/agency";
import { BookingCalendar } from "@/components/contact/booking-calendar";
import { CAL_URL } from "@/lib/booking";
import { pageMetadata } from "@/lib/seo";
import { NEEDS } from "@/lib/validation";

export const metadata = pageMetadata({
  path: "/contact",
  title: "Book a Call",
  description: "Book a free 30-minute call with Darly to talk through your software idea, business process or online store.",
});

export default async function Page({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  // Only pass through services we actually offer — it ends up in the booking notes.
  const picked = service && (NEEDS as readonly string[]).includes(service) ? service : undefined;
  return <Shell>
    <section className="d-section d-contact contact-refined">
      <div className="contact-introduction">
        <span className="d-eyebrow">A GOOD PROJECT STARTS WITH A CONVERSATION</span>
        <h1>Book a<br/><em>strategy call.</em></h1>
        <p>A new product, a better store, or a process that needs fixing. Pick a time and tell us where you are and what you want to change.</p>
        <div className="contact-expectations"><span>WHAT HAPPENS NEXT</span>
          <div><b>01</b><p>Pick a time that works for you.</p></div>
          <div><b>02</b><p>We talk through your business, your goals and the tools you use today.</p></div>
          <div><b>03</b><p>You leave with a clear next step, and we decide together if a project makes sense.</p></div>
        </div>
        <a href="mailto:dario@thedarly.agency">Prefer email? dario@thedarly.agency ↗</a>
      </div>
      <div className="contact-booking-panel">
        <div className="contact-form-title">
          <span>BOOK A CALL</span>
          <h2>{picked ? <>Let’s talk about <em>{picked}</em>.</> : "Choose a time that suits you."}</h2>
          <p>A free, no-pressure intro call. It’s fine if you’re still working out the scope.</p>        </div>
        <BookingCalendar service={picked}/>
        <a className="booking-fallback" href={CAL_URL} target="_blank" rel="noopener noreferrer">Calendar not loading? Open it on cal.com ↗</a>
      </div>
    </section>
  </Shell>;
}
