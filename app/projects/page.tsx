import type { Metadata } from "next";
import { ProjectGrid } from "@/components/project-grid";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Machine learning, embedded systems, backend, and full-stack projects by Dinupa Devinda.",
  alternates: {
    canonical: "/projects/"
  }
};

export default function ProjectsPage() {
  return (
    <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Projects"
        title="Projects"
        description="Machine learning, embedded systems, software, and engineering work."
      />
      <ProjectGrid projects={projects} />
    </section>
  );
}
