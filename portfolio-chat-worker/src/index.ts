import { generateGroundedAnswer } from "./gemini";
import { buildRagChunks } from "./knowledge";
import {
  corsHeaders,
  hasValidAdminToken,
  isGreeting,
  isTurnstileRequired,
  looksLikePromptInjection,
  readQuestion,
  readStreamWithLimit,
  allowedOrigins,
  verifyTurnstileToken
} from "./security";
import {
  VECTOR_NAMESPACE,
  embedDocument,
  hasUsefulEvidence,
  retrieveEvidence
} from "./retrieval";
import type { ChatResponse, ChatSource, RagChunk, RankedChunk } from "./types";

const DEFAULT_CONTEXT_URL = "https://www.dinupadevinda.com/portfolio-chat.json";
const DEFAULT_EMBEDDING_MODEL = "gemini-embedding-2";
const DEFAULT_EMBEDDING_DIMENSIONS = 768;
const MAX_CONTEXT_BYTES = 180_000;
const REINDEX_BATCH_SIZE = 20;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = crypto.randomUUID();
    const startedAt = Date.now();
    const origin = request.headers.get("Origin");
    const url = new URL(request.url);

    try {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: origin && allowedOrigins.has(origin) ? 204 : 403,
          headers: corsHeaders(origin)
        });
      }

      if (url.pathname === "/health") {
        return await handleHealth(request, env, origin);
      }

      if (url.pathname === "/admin/reindex") {
        return await handleReindex(request, env, origin, requestId);
      }

      if (url.pathname !== "/chat") {
        return jsonResponse({ error: "Not found" }, 404, origin);
      }

      return await handleChat(request, env, origin, requestId, startedAt);
    } catch (error) {
      logError("request_failed", requestId, error, { path: url.pathname });
      return jsonResponse({ error: "Chat service is temporarily unavailable" }, 502, origin);
    }
  }
} satisfies ExportedHandler<Env>;

async function handleChat(
  request: Request,
  env: Env,
  origin: string | null,
  requestId: string,
  startedAt: number
): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, origin);
  }

  if (!origin || !allowedOrigins.has(origin)) {
    return jsonResponse({ error: "Origin not allowed" }, 403, origin);
  }

  const clientAddress = request.headers.get("CF-Connecting-IP")?.trim() || "unknown-client";
  const rateLimit = await env.CHAT_RATE_LIMITER.limit({ key: clientAddress });
  if (!rateLimit.success) {
    return jsonResponse(
      { error: "Too many questions. Please wait a minute and try again." },
      429,
      origin,
      { "Retry-After": "60" }
    );
  }

  const questionResult = await readQuestion(request);
  if (!questionResult.ok) {
    return jsonResponse({ error: questionResult.error }, questionResult.status, origin);
  }

  const question = questionResult.question;

  if (!(await verifyTurnstileToken(questionResult.turnstileToken, request, env))) {
    logEvent("turnstile_failed", requestId, { durationMs: Date.now() - startedAt });
    return jsonResponse(
      { error: "Verification failed. Please refresh the page and try again." },
      403,
      origin
    );
  }

  if (looksLikePromptInjection(question)) {
    logEvent("prompt_injection_blocked", requestId, { durationMs: Date.now() - startedAt });
    return jsonResponse(
      buildDirectResponse(
        "I can only answer questions about Dinupa's public portfolio. I cannot reveal hidden instructions, API keys, tokens, or internal configuration.",
        "blocked"
      ),
      200,
      origin
    );
  }

  if (isGreeting(question)) {
    return jsonResponse(
      buildDirectResponse(
        "Hi. Ask me about Dinupa's machine learning projects, engineering experience, education, certifications, or contact details.",
        "direct"
      ),
      200,
      origin
    );
  }

  if (!env.GEMINI_API_KEY) {
    return jsonResponse({ error: "Chat backend is not configured" }, 500, origin);
  }

  const context = await loadPortfolioContext(env.PORTFOLIO_CONTEXT_URL);
  const chunks = buildRagChunks(context);
  const retrieval = await retrieveEvidence(question, chunks, env);

  if (!hasUsefulEvidence(retrieval)) {
    const response: ChatResponse = {
      answer:
        "The portfolio does not include enough information to answer that. You can ask about Dinupa's projects, skills, education, experience, certifications, or contact details.",
      grounded: false,
      sources: [],
      retrievalMode: retrieval.mode
    };
    logChatResult(requestId, retrieval.mode, false, [], startedAt);
    return jsonResponse(response, 200, origin);
  }

  try {
    const generated = await generateGroundedAnswer(question, retrieval.chunks, env);
    const citedChunks = generated.citedSourceIds
      .map((id) => retrieval.chunks.find((chunk) => chunk.id === id))
      .filter((chunk): chunk is RankedChunk => Boolean(chunk));
    const displayChunks = uniqueDisplaySources(citedChunks);
    const citationValid = !generated.grounded || citedChunks.length > 0;
    const grounded = generated.grounded && citationValid;
    const response: ChatResponse = {
      answer: citationValid
        ? generated.answer
        : "I found related portfolio material, but I could not verify a source for the answer. Please open the relevant project or contact Dinupa directly.",
      grounded,
      sources: grounded ? displayChunks.map(toChatSource) : [],
      retrievalMode: retrieval.mode
    };

    logChatResult(
      requestId,
      retrieval.mode,
      grounded,
      response.sources.map((source) => source.id),
      startedAt
    );
    return jsonResponse(response, 200, origin);
  } catch (error) {
    logError("generation_failed", requestId, error, { retrievalMode: retrieval.mode });
    const fallbackChunks = uniqueDisplaySources(retrieval.chunks).slice(0, 3);
    const response: ChatResponse = {
      answer: buildExtractiveFallback(fallbackChunks),
      grounded: true,
      sources: fallbackChunks.map(toChatSource),
      retrievalMode: retrieval.mode
    };
    return jsonResponse(response, 200, origin);
  }
}

async function handleHealth(
  request: Request,
  env: Env,
  origin: string | null
): Promise<Response> {
  if (request.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, 405, origin);
  }

  const canSeeDetails =
    Boolean(env.RAG_ADMIN_TOKEN) && (await hasValidAdminToken(request, env.RAG_ADMIN_TOKEN));

  if (!canSeeDetails) {
    return jsonResponse({ ok: true }, 200, origin);
  }

  let vectorize:
    | {
        reachable: true;
        vectorsCount: number;
        configuration: VectorizeIndexConfig;
      }
    | { reachable: false };

  try {
    const index = await env.VECTORIZE.describe();
    vectorize = {
      reachable: true,
      vectorsCount: index.vectorsCount,
      configuration: index.config
    };
  } catch {
    vectorize = { reachable: false };
  }

  return jsonResponse(
    {
      ok: true,
      architecture: "hybrid-rag-v2",
      vectorize,
      vectorNamespace: VECTOR_NAMESPACE,
      embeddingModel: env.GEMINI_EMBEDDING_MODEL || DEFAULT_EMBEDDING_MODEL,
      turnstileRequired: isTurnstileRequired(env)
    },
    200,
    origin
  );
}

async function handleReindex(
  request: Request,
  env: Env,
  origin: string | null,
  requestId: string
): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, origin);
  }

  const clientAddress = request.headers.get("CF-Connecting-IP")?.trim() || "unknown-client";
  const adminRateLimit = await env.ADMIN_RATE_LIMITER.limit({ key: `admin:${clientAddress}` });
  if (!adminRateLimit.success) {
    return jsonResponse(
      { error: "Too many admin requests. Please wait a minute and try again." },
      429,
      origin,
      { "Retry-After": "60" }
    );
  }

  if (!env.RAG_ADMIN_TOKEN) {
    return jsonResponse({ error: "RAG admin token is not configured" }, 500, origin);
  }

  if (!(await hasValidAdminToken(request, env.RAG_ADMIN_TOKEN))) {
    logEvent("reindex_unauthorized", requestId);
    return jsonResponse({ error: "Unauthorized" }, 401, origin);
  }

  if (!env.GEMINI_API_KEY) {
    return jsonResponse({ error: "Gemini key is not configured" }, 500, origin);
  }

  const context = await loadPortfolioContext(env.PORTFOLIO_CONTEXT_URL);
  const chunks = buildRagChunks(context);
  const vectors: VectorizeVector[] = [];

  for (const chunk of chunks) {
    const values = await embedDocument(chunk, env);
    vectors.push({
      id: chunk.id,
      values,
      namespace: VECTOR_NAMESPACE,
      metadata: {
        title: chunk.title,
        category: chunk.category,
        source: chunk.source,
        url: chunk.url || ""
      }
    });
  }

  for (const batch of chunkArray(vectors, REINDEX_BATCH_SIZE)) {
    await env.VECTORIZE.upsert(batch);
  }

  logEvent("reindex_completed", requestId, {
    chunks: vectors.length,
    namespace: VECTOR_NAMESPACE
  });

  return jsonResponse(
    {
      ok: true,
      indexedChunks: vectors.length,
      namespace: VECTOR_NAMESPACE,
      embeddingModel: env.GEMINI_EMBEDDING_MODEL || DEFAULT_EMBEDDING_MODEL,
      dimensions: getEmbeddingDimensions(env),
      note: "Vectorize upserts are asynchronous and may take a few seconds to become queryable."
    },
    200,
    origin
  );
}

async function loadPortfolioContext(contextUrl?: string): Promise<string> {
  const response = await fetch(contextUrl || DEFAULT_CONTEXT_URL, {
    cf: {
      cacheEverything: true,
      cacheTtl: 300
    },
    signal: AbortSignal.timeout(10_000)
  });

  if (!response.ok) {
    throw new Error(`Portfolio context failed with status ${response.status}`);
  }

  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > MAX_CONTEXT_BYTES) {
    throw new Error("Portfolio context is unexpectedly large");
  }

  return readStreamWithLimit(response.body, MAX_CONTEXT_BYTES);
}

function buildDirectResponse(
  answer: string,
  retrievalMode: "blocked" | "direct"
): ChatResponse {
  return {
    answer,
    grounded: retrievalMode === "direct",
    sources: [],
    retrievalMode
  };
}

function buildExtractiveFallback(chunks: RankedChunk[]): string {
  if (chunks.length === 0) {
    return "The portfolio does not include enough information to answer that clearly.";
  }

  const summaries = chunks.map((chunk) => {
    const firstSentence = chunk.text.split(/(?<=[.!?])\s+/)[0] || chunk.text;
    return `- ${chunk.title}: ${firstSentence.slice(0, 280)}`;
  });

  return ["The most relevant portfolio information is:", ...summaries].join("\n");
}

function toChatSource(chunk: RankedChunk): ChatSource {
  return {
    id: chunk.id,
    title: chunk.title,
    category: chunk.category,
    url: chunk.url,
    preview: chunk.text.replace(/\s+/g, " ").trim().slice(0, 180)
  };
}

function isDisplaySource(chunk: RankedChunk): boolean {
  return chunk.id !== "answering-rules";
}

function uniqueDisplaySources(chunks: RankedChunk[]): RankedChunk[] {
  const seen = new Set<string>();
  const output: RankedChunk[] = [];

  for (const chunk of chunks) {
    if (!isDisplaySource(chunk)) {
      continue;
    }

    const key = `${chunk.title.toLowerCase()}|${chunk.url || ""}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    output.push(chunk);
  }

  return output;
}

function jsonResponse(
  body: unknown,
  status: number,
  origin: string | null,
  additionalHeaders: HeadersInit = {}
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin),
      ...additionalHeaders
    }
  });
}

function getEmbeddingDimensions(env: Env): number {
  const configured = Number(env.RAG_EMBEDDING_DIMENSIONS);
  return Number.isInteger(configured) && configured >= 128 && configured <= 3072
    ? configured
    : DEFAULT_EMBEDDING_DIMENSIONS;
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function logChatResult(
  requestId: string,
  retrievalMode: string,
  grounded: boolean,
  sourceIds: string[],
  startedAt: number
): void {
  logEvent("chat_completed", requestId, {
    retrievalMode,
    grounded,
    sourceIds,
    durationMs: Date.now() - startedAt
  });
}

function logEvent(event: string, requestId: string, details: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ event, requestId, ...details }));
}

function logError(
  event: string,
  requestId: string,
  error: unknown,
  details: Record<string, unknown> = {}
): void {
  console.error(
    JSON.stringify({
      event,
      requestId,
      error: error instanceof Error ? error.message : String(error),
      ...details
    })
  );
}
