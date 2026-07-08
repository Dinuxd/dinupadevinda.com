import type { Project } from "@/content/projects";
import { ProjectCard } from "./project-card";

type ProjectGridProps = {
  projects: Project[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  const rendered = new Set<string>();

  return (
    <div className="mt-10 grid gap-5 lg:grid-cols-2">
      {projects.map((project, index) => {
        if (rendered.has(project.slug)) {
          return null;
        }

        if (project.presentation === "compact") {
          const compactGroup = [project];
          let nextIndex = index + 1;

          while (projects[nextIndex]?.presentation === "compact") {
            compactGroup.push(projects[nextIndex]);
            nextIndex += 1;
          }

          compactGroup.forEach((compactProject) => rendered.add(compactProject.slug));

          return (
            <div key={`compact-${project.slug}`} className="grid gap-5 self-start">
              {compactGroup.map((compactProject) => (
                <ProjectCard key={compactProject.slug} project={compactProject} compact />
              ))}
            </div>
          );
        }

        return <ProjectCard key={project.slug} project={project} />;
      })}
    </div>
  );
}
