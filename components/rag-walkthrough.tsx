"use client";

import { useId, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, FileSearch, ExternalLink } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import replay from '@/content/rag-walkthrough.json';

const stages = ['Question', 'Retrieved sources', 'Evidence', 'Answer context'];

export function RagWalkthrough() {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const id = useId();
  const reduced = useReducedMotion();
  const sample = replay.samples[sampleIndex];
  return <section className="rag-walkthrough" aria-label="RAG retrieval walkthrough">
    <div className="flex items-center gap-2"><FileSearch size={18} aria-hidden="true" /><h4 className="font-semibold">Inside the retrieval</h4></div>
    <p className="mt-2 text-xs leading-5 text-slate-400">Saved keyword retrieval. No live vector search or generated answer.</p>
    <label htmlFor={id} className="mt-4 block text-sm">Sample question</label>
    <select id={id} value={sampleIndex} onChange={event => { setSampleIndex(Number(event.target.value)); setStep(0); }}>
      {replay.samples.map((item, index) => <option key={item.question} value={index}>{item.question}</option>)}
    </select>
    <ol className="rag-stages">{stages.map((stage, index) => <li key={stage}>
      <button type="button" aria-current={index === step ? 'step' : undefined} onClick={() => setStep(index)}><span>{index + 1}</span>{stage}</button>
    </li>)}</ol>
    <motion.div key={`${sampleIndex}-${step}`} className="rag-stage-content" initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: .18 }} aria-live="polite" aria-atomic="true">
      <h5>{stages[step]}</h5>
      {step === 0 && <p>{sample.question}</p>}
      {step === 1 && <ol className="rag-source-list">{sample.sources.map((source, index) => <li key={source.title}>
        <span>{index + 1}. {source.title}</span>
        <div className="rag-score-track" aria-hidden="true"><motion.div initial={{ scaleX: reduced ? source.score : 0 }} animate={{ scaleX: source.score }} transition={{ duration: reduced ? 0 : .35 }} /></div>
        <small>Keyword score: {source.score.toFixed(3)}</small>
      </li>)}</ol>}
      {step === 2 && <div className="rag-evidence"><p className="font-medium">{sample.sources[0].title}</p><pre>{sample.sources[0].text}</pre></div>}
      {step === 3 && <><p>These passages are ready to supply evidence for an answer. In the live assistant, Gemini receives the selected context and returns source citations.</p><ul className="rag-source-list">{sample.sources.map(source => <li key={source.title}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ExternalLink size={14} aria-hidden="true" /></a></li>)}</ul></>}
    </motion.div>
    <div className="rag-controls">
      <button type="button" title="Restart walkthrough" aria-label="Restart walkthrough" onClick={() => setStep(0)} disabled={step === 0}><RotateCcw size={16} /></button>
      <span>{step + 1} / {stages.length}</span>
      <button type="button" title="Previous step" aria-label="Previous step" onClick={() => setStep(step - 1)} disabled={step === 0}><ArrowLeft size={16} /></button>
      <button type="button" title="Next step" aria-label="Next step" onClick={() => setStep(step + 1)} disabled={step === stages.length - 1}><ArrowRight size={16} /></button>
    </div>
  </section>;
}
