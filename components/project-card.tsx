import { Github, Linkedin } from "lucide-react";
import type { Project } from "@/content/projects";
import { ButtonLink } from "./button-link";
import { MediaFrame } from "./media-frame";
import { MetricCard } from "./metric-card";

export function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  const showMedia = project.media && project.media.type === "image";
  const wideClass = project.layout === "wide" ? "lg:col-span-2" : "";
  const articleClass = compact
    ? "flex flex-col glass rounded-2xl p-5"
    : `flex h-full flex-col glass rounded-2xl p-5 ${wideClass}`;

  return (
    <article className={articleClass}>
      {!compact && showMedia ? <MediaFrame media={project.media} priority={project.priority <= 2} /> : null}
      {!compact && project.media?.type === "video" ? (
        <video
          className="media-depth aspect-[16/10] w-full rounded-xl border border-cyan-300/12 bg-graphite-900/60 object-cover"
          controls
          playsInline
          preload="none"
          poster={project.media.poster}
          aria-label={project.media.alt}
        >
          <source src={project.media.src} type="video/mp4" />
        </video>
      ) : null}
      <div className={compact ? "" : "mt-5"}>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-signal-green">
          <span>{project.status}</span>
          <span className="text-slate-600">/</span>
          <span>{project.role}</span>
        </div>
        <h3 className={`mt-3 font-semibold tracking-tight text-white ${compact ? "text-lg" : "text-xl"}`}>
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">{project.summary}</p>
      </div>

      {!compact && project.detailPoints ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {project.detailPoints.map((point) => (
            <div key={`${project.slug}-${point.label}`} className="soft-panel rounded-xl p-4">
              <h4 className="text-sm font-semibold text-signal-cyan">{point.label}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-400">{point.text}</p>
            </div>
          ))}
        </div>
      ) : null}

      {compact ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {project.metrics.slice(0, 3).map((metric) => (
            <div key={`${project.slug}-${metric.label}`} className="soft-panel rounded-lg px-3 py-2">
              <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-signal-cyan">
                {metric.label}
              </div>
              <div className="mt-1 break-words text-sm font-semibold leading-snug text-white">{metric.value}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {project.metrics.slice(0, 3).map((metric) => (
            <MetricCard key={`${project.slug}-${metric.label}`} metric={metric} />
          ))}
        </div>
      )}

      <div className={`${compact ? "mt-4" : "mt-5"} flex flex-wrap gap-2`}>
        {project.domains.map((domain) => (
          <span
            key={`${project.slug}-${domain}`}
            className="rounded-lg border border-cyan-300/15 bg-cyan-300/10 px-2.5 py-1 text-xs font-medium text-cyan-200"
          >
            {domain}
          </span>
        ))}
      </div>

      <div className={`${compact ? "mt-3" : "mt-4"} flex flex-wrap gap-2`}>
        {project.stack.slice(0, compact ? 6 : 10).map((item) => (
          <span key={`${project.slug}-${item}`} className="text-xs text-slate-400">
            {item}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap gap-3 pt-6">
        {project.repoUrl ? (
          <ButtonLink href={project.repoUrl} icon={Github} variant="secondary" external>
            GitHub
          </ButtonLink>
        ) : null}
        {project.linkedinUrl ? (
          <ButtonLink href={project.linkedinUrl} icon={Linkedin} variant="secondary" external>
            LinkedIn
          </ButtonLink>
        ) : null}
      </div>
    </article>
  );
}
