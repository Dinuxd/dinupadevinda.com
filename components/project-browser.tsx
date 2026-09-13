"use client";

import { useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import type { Project, ProjectDomain } from '@/content/projects';
import { ProjectGrid } from './project-grid';

const filters: { label: string; domains: ProjectDomain[] }[] = [
  { label: 'All', domains: [] },
  { label: 'AI / ML', domains: ['AI Systems', 'LLM Interpretability', 'Edge AI', 'Computer Vision', 'Audio ML', 'Sensor Fusion'] },
  { label: 'Software', domains: ['Software', 'Backend', 'Full Stack'] },
  { label: 'Embedded / IoT', domains: ['Embedded/IoT', 'Hardware'] }
];

export function ProjectBrowser({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState(0);
  const visible = projects.filter(project => selected === 0 || project.domains.some(domain => filters[selected].domains.includes(domain)));
  return <MotionConfig reducedMotion="user">
    <div className="project-filters" role="group" aria-label="Filter projects">
      {filters.map((filter, index) => <button key={filter.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{filter.label}</button>)}
      <span role="status">{visible.length} projects</span>
    </div>
    <motion.div key={selected} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .18 }}>
      <ProjectGrid projects={visible} />
    </motion.div>
  </MotionConfig>;
}
