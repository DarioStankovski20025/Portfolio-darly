"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const scenes = [
  {name:"Capture",title:"An order lands in your store.",description:"One customer action starts the process. The order details enter a connected workflow.",nodes:["Order received","Waiting for order","Waiting for order","Waiting for order"]},
  {name:"Connect",title:"The right information moves with it.",description:"The order is checked and stock is updated. Your tools share the same information.",nodes:["Order checked","Stock updated","Preparing fulfillment","Waiting for update"]},
  {name:"Coordinate",title:"Your team knows what happens next.",description:"Fulfillment receives the request, with a clear status for the people managing the order.",nodes:["Order synchronized","Stock synchronized","Request ready","Updating workspace"]},
  {name:"See clearly",title:"One shared view. Fewer loose ends.",description:"The workspace brings the updates together. Your team can focus on exceptions and customer care.",nodes:["Order synchronized","Stock synchronized","Fulfillment queued","Workspace updated"]},
];
export function ConnectedStage(){
  const ref=useRef<HTMLElement>(null);
  const visible=useInView(ref,{amount:.25});
  const reduced=useReducedMotion();
  const [step,setStep]=useState(0);
  const [paused,setPaused]=useState(false);
  useEffect(()=>{if(!visible||reduced||paused)return;const id=setInterval(()=>setStep(s=>(s+1)%4),4000);return()=>clearInterval(id)},[visible,reduced,paused]);
  return <section className="connected-stage" ref={ref}>
    <div className="connected-heading"><div><span className="d-eyebrow">THE BIGGER PICTURE / SYSTEMS WORKING TOGETHER</span><h2>One order.<br/><em>Everything in motion.</em></h2></div><p>We connect the tools behind your business so one update reaches the places it needs to go.</p></div>
    <div className={'network-canvas phase-'+step}>
      <svg className="network-lines" viewBox="0 0 1000 450" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="#314f70" strokeWidth="1"><path d="M200 110 H370 Q400 110 400 140 V195 H500"/><path d="M800 110 H630 Q600 110 600 140 V195 H500"/><path d="M200 340 H370 Q400 340 400 310 V255 H500"/><path d="M800 340 H630 Q600 340 600 310 V255 H500"/></g>{visible&&!paused&&!reduced&&<g fill="none" stroke="#7fc6ff" strokeWidth="2" strokeDasharray="12 400" className="network-packets"><path d="M200 110 H370 Q400 110 400 140 V195 H500"/><path d="M500 195 H600 V140 Q600 110 630 110 H800"/><path d="M500 255 H400 V310 Q400 340 370 340 H200"/><path d="M500 255 H600 V310 Q600 340 630 340 H800"/></g>}</svg>
      <div className="network-center"><span>CONNECTED BY</span><strong>darly</strong><small>Your business logic.<br/>Your tools, in sync.</small></div>
      {['Online store','Inventory','Fulfillment','Team workspace'].map((label,i)=><motion.div className={'network-node node-'+i+(step>=i?' is-ready':'')} key={label} animate={{borderColor:step>=i?'#5985b7':'#263a52'}} transition={{duration:.5}}><div><span>0{i+1}</span><strong>{label}</strong><b>{step>=i?'↗':'·'}</b></div><p>{scenes[step].nodes[i]}</p><small>{['ORDER / DEMO-1042','PRODUCT / DAILY CARE','NEXT STEP / DISPATCH','ONE SHARED RECORD'][i]}</small></motion.div>)}
    </div>
    <div className="network-narrative"><span className="network-count">0{step+1}<small>/ 04</small></span><div><h3>{scenes[step].title}</h3><p>{scenes[step].description}</p></div><button onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?'Play animation':'Pause animation'}</button></div>
    <div className="network-controls">{scenes.map((scene,i)=><button key={scene.name} aria-pressed={step===i} onClick={()=>{setStep(i);setPaused(true)}}><span>0{i+1}</span>{scene.name}</button>)}<small>Illustrative system · Example data</small></div>
  </section>
}
