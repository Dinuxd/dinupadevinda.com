import type { Project } from "@/content/projects";
import { ProjectCard } from "./project-card";

type ProjectGridProps = {
  projects: Project[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  const rendered = new Set<string>();

  return (
    <div className="mt-10 columns-1 gap-5 lg:columns-2">
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
            <div key={`compact-${project.slug}`} className="mb-5 grid break-inside-avoid gap-5">
              {compactGroup.map((compactProject) => (
                <ProjectCard key={compactProject.slug} project={compactProject} compact />
              ))}
            </div>
          );
        }

        return (
          <div key={project.slug} className="mb-5 break-inside-avoid">
            <ProjectCard project={project} />
          </div>
        );
      })}
    </div>
  );
}
