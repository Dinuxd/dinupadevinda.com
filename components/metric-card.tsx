import type { ProjectMetric } from "@/content/projects";

export function MetricCard({ metric }: { metric: ProjectMetric }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.035] p-4">
      <div className="text-sm font-medium text-signal-cyan">{metric.label}</div>
      <div className="mt-1 break-words text-lg font-semibold leading-snug tracking-tight text-white">{metric.value}</div>
      {metric.detail ? <p className="mt-2 text-xs leading-5 text-slate-400">{metric.detail}</p> : null}
    </div>
  );
}
