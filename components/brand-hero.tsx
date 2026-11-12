"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export function BrandHero() {
  const reduced = useReducedMotion();
  return <section className="studio-hero">
    <div className="studio-mast"><span>DARLY — DESIGN & DEVELOPMENT</span><span>BUILT FOR THE WAY YOU DO BUSINESS</span></div>
    <motion.div className="studio-title" initial={{opacity:0,y:reduced?0:22}} animate={{opacity:1,y:0}} transition={{duration:.8}}>
      <span className="d-eyebrow">YOUR NEXT CHAPTER, BUILT RIGHT.</span>
      <h1>We build software<br/>and <em>e-commerce.</em></h1>
      <div className="studio-intro"><p>Custom business platforms. AI that handles the busywork. Online stores that make buying easier. Thoughtfully designed and built around you.</p><div className="d-actions"><Link className="d-button" href="/contact">Let’s discuss your project <span>↗</span></Link><Link className="studio-work-link" href="#services">Explore what we can build ↓</Link></div></div>
    </motion.div>
    <div className="hero-possibilities">
      <div className="possibility-caption"><span>WHAT WOULD MAKE YOUR BUSINESS WORK BETTER?</span><span>START WITH THE PROBLEM. WE’LL BUILD FROM THERE.</span></div>
      <div className="possibility-grid">
        {[
          {number:"01",title:"Your operations, in one place.",text:"Custom software that brings your customers, projects and information together.",label:"CUSTOM SOFTWARE",href:"/services/software-development",words:["Customers","Projects","Reporting"],result:"One shared workspace"},
          {number:"02",title:"Less busywork. More progress.",text:"AI workflows that handle repetitive tasks while your team stays in control.",label:"AI AUTOMATION",href:"/services/ai-automation",words:["Capture","Review","Connect"],result:"A smoother working day"},
          {number:"03",title:"An easier way to buy.",text:"Better storefronts, clearer product content and connected commerce operations.",label:"E-COMMERCE",href:"/services/ecommerce",words:["Discover","Choose","Purchase"],result:"A considered shopping journey"},
        ].map((item,i)=><motion.div key={item.number} initial={{opacity:0,y:reduced?0:25}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.15+i*.12}}><Link className="possibility" href={item.href}><div className="possibility-top"><span>{item.number} / {item.label}</span><b>↗</b></div><h2>{item.title}</h2><p>{item.text}</p><div className="possibility-visual" aria-hidden="true"><div>{item.words.map((word,j)=><motion.span key={word} initial={{opacity:.35}} animate={{opacity:1}} transition={{duration:reduced?0:.6,delay:reduced?0:.5+i*.12+j*.2}}>{word}</motion.span>)}</div><div className="possibility-line"/><strong>{item.result}</strong></div></Link></motion.div>)}
      </div>
    </div>
    <div className="hero-principles"><span>BUILT WITH YOU, NOT JUST FOR YOU.</span><span>Clear scope & priorities</span><span>Visible progress</span><span>Support beyond launch</span></div>
  </section>;
}
