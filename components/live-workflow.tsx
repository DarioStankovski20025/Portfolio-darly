"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

const steps = [
  { title: "Request received", label: "INBOX", detail: "From: Alex at North Studio", body: "Please prepare a proposal for our new customer portal.", status: "New project enquiry", fields: ["Sender identified", "Message captured"] },
  { title: "Details extracted", label: "AI PROCESSING", detail: "Turning a message into useful information", body: "Company: North Studio · Request: Customer portal", status: "Ready for human review", fields: ["Company → North Studio", "Service → Client portal"] },
  { title: "Team reviews", label: "HUMAN CHECKPOINT", detail: "Your team stays in control", body: "Check the request and approve the information before it moves into your systems.", status: "Approved in this example", fields: ["Details checked", "Next step agreed"] },
  { title: "Workspace updated", label: "CONNECTED SOFTWARE", detail: "One record. Available to the whole team.", body: "The approved enquiry is added to your customer workspace with an owner and next step.", status: "Ready for follow-up", fields: ["Customer record created", "Follow-up task assigned"] },
];

export function LiveWorkflow({compact=false}:{compact?:boolean}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, {amount:.25});
  const reduced = useReducedMotion();
  const [step,setStep] = useState(0);
  const [paused,setPaused] = useState(false);
  useEffect(()=>{
    if(!visible || reduced || paused) return;
    const timer=setInterval(()=>setStep(s=>(s+1)%steps.length),3600);
    return ()=>clearInterval(timer);
  },[visible,reduced,paused]);
  const current=steps[step];
  return <div ref={ref} className={'live-workflow '+(compact?'compact':'')}>
    <div className="live-heading"><span>EMAIL → ORGANIZED WORK</span><button onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?'Play demo':'Pause demo'}</button></div>
    <div className="live-rail">{steps.map((s,i)=><button key={s.title} aria-pressed={i===step} onClick={()=>{setStep(i);setPaused(true)}}><span>{i<step?'✓':`0${i+1}`}</span><strong>{s.title}</strong>{i===step&&!paused&&!reduced&&<motion.i key={step} initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:3.6,ease:'linear'}}/>}</button>)}</div>
    <div className="live-stage"><AnimatePresence mode="wait"><motion.div key={step} initial={{opacity:0,y:reduced?0:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-8}} transition={{duration:.3}}><small>{current.label}</small><h3>{current.detail}</h3><p>{current.body}</p><div className="live-fields">{current.fields.map((f,i)=><motion.span key={f} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:reduced?0:.2+i*.15}}>✓ {f}</motion.span>)}</div><div className="live-result"><span/> {current.status}</div></motion.div></AnimatePresence></div>
    <footer>Illustrative workflow · Example data · Human review included</footer>
  </div>;
}
