import { transformerScopeDemo } from "@/content/transformer-scope-demo";

function percent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

function signed(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(4)}`;
}

export function TransformerScopeDemo() {
  const demo = transformerScopeDemo;
  const maxPrediction = Math.max(...demo.predictions.map((item) => item.probability));
  const maxAttention = Math.max(...demo.attention.sources.map((item) => item.weight));

  return (
    <details className="group mt-5 rounded-2xl border border-cyan-300/18 bg-graphite-950/55 p-4">
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
        <span>
          <span className="block text-xs font-bold uppercase tracking-[0.22em] text-signal-cyan">
            View sample analysis
          </span>
          <span className="mt-1 block text-sm leading-6 text-slate-400">
            A small GPT-2 example from the local workbench.
          </span>
        </span>
        <span className="rounded-lg border border-cyan-300/15 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100">
          <span className="group-open:hidden">Open</span>
          <span className="hidden group-open:inline">Close</span>
        </span>
      </summary>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-signal-cyan">
            Sample output
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            These values come from saved GPT-2-small outputs, so visitors can inspect the idea without running the full local dashboard.
          </p>
        </div>
        <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/10 px-3 py-2 text-right text-xs text-slate-300">
          <span className="block font-semibold text-white">{demo.status.parameters}</span>
          <span>{demo.status.layers} layers / {demo.status.headsPerLayer} heads</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/22 p-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Prompt</p>
        <p className="mt-2 font-mono text-sm text-slate-100">{demo.prompt}</p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="soft-panel rounded-xl p-4">
          <h4 className="text-sm font-semibold text-signal-cyan">Next-token prediction</h4>
          <div className="mt-3 space-y-3">
            {demo.predictions.map((prediction) => (
              <div key={prediction.token} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3 text-xs">
                <span className="font-mono text-slate-200">{JSON.stringify(prediction.token)}</span>
                <span className="h-2 overflow-hidden rounded-full bg-slate-700/70">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300"
                    style={{ width: `${(prediction.probability / maxPrediction) * 100}%` }}
                  />
                </span>
                <span className="text-right text-slate-400">{percent(prediction.probability)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="soft-panel rounded-xl p-4">
          <h4 className="text-sm font-semibold text-signal-cyan">
            Attention L{demo.attention.layer}H{demo.attention.head}
          </h4>
          <div className="mt-3 space-y-3">
            {demo.attention.sources.map((source) => (
              <div key={source.token} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3 text-xs">
                <span className="font-mono text-slate-200">{JSON.stringify(source.token)}</span>
                <span className="h-2 overflow-hidden rounded-full bg-slate-700/70">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300"
                    style={{ width: `${(source.weight / maxAttention) * 100}%` }}
                  />
                </span>
                <span className="text-right text-slate-400">{percent(source.weight)}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">{demo.attention.note}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="soft-panel rounded-xl p-4">
          <h4 className="text-sm font-semibold text-signal-cyan">Raw logit-lens path</h4>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {demo.logitLens.map((stage) => (
              <div key={stage.stage} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Stage {stage.stage}</p>
                <p className="mt-1 truncate font-mono text-xs text-slate-200">{JSON.stringify(stage.token)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="soft-panel rounded-xl p-4">
          <h4 className="text-sm font-semibold text-signal-cyan">Fixed ablation</h4>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Target</span>
              <span className="font-mono text-slate-200">{JSON.stringify(demo.ablation.target)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Baseline</span>
              <span className="text-slate-200">{percent(demo.ablation.baselineProbability)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Mean ablation</span>
              <span className="text-slate-200">{percent(demo.ablation.ablatedProbability)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Logit delta</span>
              <span className="text-slate-200">{signed(demo.ablation.logitDelta)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">{demo.ablation.note}</p>
        </div>
      </div>
    </details>
  );
}
