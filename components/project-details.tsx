"use client";

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export function ProjectDetails({ points }: { points: { label: string; text: string }[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const reduced = useReducedMotion();
  return <div className="project-details">
    <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
      {open ? 'Hide project details' : 'View project details'}
      <ChevronDown size={16} aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : undefined }} />
    </button>
    <AnimatePresence initial={false}>
      {open && <motion.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : .22 }} className="overflow-hidden">
        <dl>{points.map(point => <div key={point.label}><dt>{point.label}</dt><dd>{point.text}</dd></div>)}</dl>
      </motion.div>}
    </AnimatePresence>
  </div>;
}
