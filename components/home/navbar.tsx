"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { offers, groups } from "@/lib/offers";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

const DESKTOP = "(min-width: 701px)";
const isDesktop = () => window.matchMedia(DESKTOP).matches;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const header = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const hamburger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const [shownPath, setShownPath] = useState(pathname);
  const close = () => { setOpen(false); setMobile(false); };

  // Any navigation (links, back button) closes both menus.
  if (shownPath !== pathname) { setShownPath(pathname); close(); }

  // Mobile sheet: lock the page behind it, size it to the space under the
  // header, and drop it if the viewport grows into the desktop layout.
  useEffect(() => {
    if (!mobile) return;
    const el = header.current;
    const measure = () => el?.style.setProperty("--nav-h", `${el.getBoundingClientRect().bottom}px`);
    measure();
    lockScroll();
    const mq = window.matchMedia(DESKTOP);
    const onChange = () => { if (mq.matches) close(); };
    mq.addEventListener("change", onChange);
    window.addEventListener("resize", measure);
    return () => {
      unlockScroll();
      mq.removeEventListener("change", onChange);
      window.removeEventListener("resize", measure);
    };
  }, [mobile]);

  return <header ref={header} className="d-nav refined-nav" data-menu-open={mobile || undefined}
    onPointerLeave={e => { if (e.pointerType === "mouse" && isDesktop()) setOpen(false); }}
    onKeyDown={e => { if (e.key === "Escape") { close(); (mobile ? hamburger : trigger).current?.focus(); } }}
    // Desktop only: iOS Safari does not focus buttons on tap, so on phones a
    // blur fires with no relatedTarget the moment you tap "Services" after a
    // link — which used to slam the whole menu shut.
    onBlur={e => { if (isDesktop() && !e.currentTarget.contains(e.relatedTarget)) close(); }}>
    <Link href="/" className="d-logo" aria-label="Darly home" onClick={close}>darly<span>®</span></Link>
    <button ref={hamburger} type="button" className="d-mobile" aria-label={mobile ? "Close navigation" : "Open navigation"} onClick={() => { setMobile(!mobile); setOpen(false); }} aria-expanded={mobile} aria-controls="main-navigation"><span/><span/><span/></button>
    <nav id="main-navigation" className={mobile ? "d-links visible" : "d-links"} aria-label="Main navigation">
      <Link href="/" onClick={close}>Home</Link>
      <div className="nav-services">
        <button ref={trigger} type="button" className="nav-services-trigger" onPointerEnter={e => { if (e.pointerType === "mouse" && isDesktop()) setOpen(true); }} aria-expanded={open} aria-controls="services-menu" onClick={() => setOpen(!open)}>Services <span aria-hidden="true">{open ? "−" : "+"}</span></button>
        {open && <div className="d-mega" id="services-menu">{groups.map((g, i) => <div key={g.slug}>
          <Link className="d-menu-heading" href={"/services/" + g.slug} onClick={close}>{g.title} ↗</Link>
          {offers.filter(o => o.group === (i ? "ecommerce" : "software")).map(o => <Link key={o.slug} href={"/services/" + o.slug} onClick={close}><strong>{o.title}</strong><small>{o.headline}</small></Link>)}
        </div>)}</div>}
      </div>
      <Link href="/case-studies" onClick={close}>Our Work</Link>
      <Link href="/about" onClick={close}>About</Link>
      <Link href="/contact" onClick={close}>Contact</Link>
      <Link className="d-button" href="/contact" onClick={close}>Let’s Talk ↗</Link>
    </nav>
  </header>;
}
