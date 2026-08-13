"use client";

import { useId, useMemo, useState } from "react";
import { Loader2, Play, RotateCcw } from "lucide-react";

type StoryResponse = {
  story?: string;
  latency_ms?: number;
  model?: string;
  parameters?: {
    temperature?: number;
    top_k?: number;
    max_new_tokens?: number;
    seed?: number;
  };
  error?: string;
};

const storyApiUrl =
  normalizeStoryApiUrl(process.env.NEXT_PUBLIC_STORY_API_URL) ??
  "https://tinystories-gpt-proxy.dwmddevinda.workers.dev/generate";

function normalizeStoryApiUrl(value: string | undefined) {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (url.hostname !== "tinystories-gpt-proxy.dwmddevinda.workers.dev") {
      return undefined;
    }
    url.pathname = "/generate";
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return undefined;
  }
}

const defaultPrompt = "Once upon a time";
const defaultMaxTokens = 80;
const maxTokenLimit = 160;
const defaultTemperature = 0.7;
const defaultTopK = 32;
const defaultSeed = 42;

export function StoryGenerator() {
  const promptId = useId();
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [temperature, setTemperature] = useState(defaultTemperature);
  const [topK, setTopK] = useState(defaultTopK);
  const [maxTokens, setMaxTokens] = useState(defaultMaxTokens);
  const [seed, setSeed] = useState(defaultSeed);
  const [story, setStory] = useState("");
  const [latency, setLatency] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const statusText = useMemo(() => {
    if (isGenerating) {
      return "Generating on AWS EC2...";
    }
    if (story) {
      return latency ? `Generated in ${latency} ms` : "Generated";
    }
    return "Runs through the Cloudflare proxy and AWS model API.";
  }, [isGenerating, latency, story]);

  async function generateStory() {
    setError("");
    setStory("");
    setLatency(null);
    setIsGenerating(true);

    try {
      const response = await fetch(storyApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          temperature,
          top_k: topK,
          max_new_tokens: maxTokens,
          seed
        })
      });

      const data = (await response.json().catch(() => ({}))) as StoryResponse;

      if (!response.ok) {
        throw new Error(
          data.error ?? `The story generator returned HTTP ${response.status}.`
        );
      }

      setStory(data.story ?? "");
      setLatency(data.latency_ms ?? null);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The story generator is unavailable right now. Try fewer tokens and run it again."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function resetControls() {
    setPrompt(defaultPrompt);
    setTemperature(defaultTemperature);
    setTopK(defaultTopK);
    setMaxTokens(defaultMaxTokens);
    setSeed(defaultSeed);
    setStory("");
    setLatency(null);
    setError("");
  }

  return (
    <div className="mt-6 rounded-2xl border border-cyan-300/18 bg-slate-950/48 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-cyan">
            Live test
          </p>
          <p className="mt-1 text-sm text-slate-400">{statusText}</p>
        </div>
        <button
          type="button"
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
          onClick={() => setIsOpen((open) => !open)}
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          {isOpen ? "Hide test" : "Test model"}
        </button>
      </div>

      {isOpen ? (
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2" htmlFor={promptId}>
            <span className="text-sm font-semibold text-white">Prompt</span>
            <textarea
              id={promptId}
              className="focus-ring min-h-24 resize-y rounded-xl border border-cyan-300/16 bg-slate-950/72 px-3 py-3 text-sm leading-6 text-white placeholder:text-slate-500"
              maxLength={512}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Start the story..."
            />
          </label>
          <p className="text-xs leading-5 text-slate-400">
            Max tokens are capped at {maxTokenLimit} for this AWS free-tier CPU
            demo, so the test stays responsive and avoids long requests.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <Control
              label="Temperature"
              value={temperature}
              min={0.2}
              max={1.5}
              step={0.1}
              onChange={setTemperature}
            />
            <Control label="Top-k" value={topK} min={1} max={100} step={1} onChange={setTopK} />
            <Control
              label="Max tokens"
              value={maxTokens}
              min={20}
              max={maxTokenLimit}
              step={10}
              onChange={setMaxTokens}
            />
            <label className="grid gap-3 rounded-xl border border-cyan-300/12 bg-slate-950/44 p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                Seed
              </span>
              <input
                className="focus-ring rounded-lg border border-cyan-300/14 bg-slate-950/80 px-3 py-2 text-sm font-semibold text-white"
                type="number"
                min={0}
                max={999999}
                value={seed}
                onChange={(event) => setSeed(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={generateStory}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Play className="h-4 w-4" aria-hidden="true" />
              )}
              Generate story
            </button>
            <button
              type="button"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/18 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/38 hover:text-white"
              onClick={resetControls}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </button>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          {story ? (
            <div className="rounded-xl border border-teal-300/18 bg-slate-950/60 p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.14em] text-slate-500">
                <span>Generated story</span>
                {latency ? <span>{latency} ms</span> : null}
              </div>
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-100">{story}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Control({
  label,
  value,
  min,
  max,
  step,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-3 rounded-xl border border-cyan-300/12 bg-slate-950/44 p-4">
      <span className="flex items-center justify-between gap-3">
        <span className="min-w-0 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
          {label}
        </span>
        <span className="shrink-0 rounded-md border border-cyan-300/12 bg-slate-950/70 px-2 py-1 text-xs font-semibold text-white">
          {value}
        </span>
      </span>
      <input
        className="h-2 w-full accent-cyan-300"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
