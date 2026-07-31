import type { RagChunk, RankedChunk, RetrievalResult } from "./types";

const GEMINI_EMBEDDING_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_EMBEDDING_MODEL = "gemini-embedding-2";
const DEFAULT_EMBEDDING_DIMENSIONS = 768;
const VECTOR_CANDIDATE_LIMIT = 12;
const LEXICAL_CANDIDATE_LIMIT = 12;
const FINAL_RESULT_LIMIT = 6;
const RRF_K = 60;

export const VECTOR_NAMESPACE = "portfolio-v2";

type LexicalCandidate = {
  chunk: RagChunk;
  score: number;
};

type VectorCandidate = {
  chunk: RagChunk;
  score: number;
};

type FusionEntry = {
  chunk: RagChunk;
  score: number;
  lexicalScore: number;
  vectorScore?: number;
  matchedBy: Set<"keyword" | "vector">;
};

const STOP_WORDS = new Set([
  "a",
  "about",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "can",
  "did",
  "do",
  "does",
  "for",
  "from",
  "has",
  "have",
  "he",
  "his",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "of",
  "on",
  "or",
  "the",
  "this",
  "to",
  "was",
  "what",
  "when",
  "where",
  "which",
  "who",
  "with"
]);

const QUERY_EXPANSIONS: Array<[RegExp, string]> = [
  [/\bfyp\b/i, "final year project vehicular black box"],
  [/\brag\b/i, "retrieval augmented generation embeddings vector search"],
  [/\bcv\b/i, "computer vision"],
  [/\bslt\b/i, "sri lanka telecom"],
  [/\bimu\b/i, "inertial measurement unit accelerometer gyroscope sensor"],
  [/\bmlops\b/i, "machine learning operations deployment evaluation monitoring"],
  [/\bai\b/i, "artificial intelligence machine learning"],
  [/\bml\b/i, "machine learning"]
];

const CATEGORY_INTENTS: Array<{ pattern: RegExp; categories: string[] }> = [
  { pattern: /project|built|github|model|system|use|uses|using|stack/i, categories: ["Projects"] },
  { pattern: /education|degree|sliit|kelaniya|cima|stud/i, categories: ["Education"] },
  { pattern: /experience|intern|trainee|slt|variosystems|work/i, categories: ["Experience"] },
  { pattern: /certificate|certification|credential|award|honor/i, categories: ["Certifications", "Honors"] },
  { pattern: /chatbot|assistant|rag|embedding|vector|gemini|cloudflare/i, categories: ["AI Systems"] },
  { pattern: /contact|email|linkedin|location|github|cv/i, categories: ["Profile"] }
];

export async function retrieveEvidence(
  question: string,
  chunks: RagChunk[],
  env: Env
): Promise<RetrievalResult> {
  const lexicalCandidates = lexicalSearch(question, chunks, LEXICAL_CANDIDATE_LIMIT);
  let vectorCandidates: VectorCandidate[] = [];

  try {
    vectorCandidates = await vectorSearch(question, chunks, env);
  } catch (error) {
    console.warn(
      JSON.stringify({
        event: "vector_retrieval_failed",
        error: normalizeError(error)
      })
    );
  }

  return {
    mode: vectorCandidates.length > 0 ? "hybrid" : "lexical",
    chunks: fuseRankings(lexicalCandidates, vectorCandidates, FINAL_RESULT_LIMIT),
    diagnostics: {
      lexicalCandidates: lexicalCandidates.length,
      vectorCandidates: vectorCandidates.length
    }
  };
}

export function lexicalSearch(
  question: string,
  chunks: RagChunk[],
  limit = LEXICAL_CANDIDATE_LIMIT
): LexicalCandidate[] {
  const expandedQuestion = expandQuery(question);
  const queryTerms = unique(tokenize(expandedQuestion));

  if (queryTerms.length === 0 || chunks.length === 0) {
    return [];
  }

  const documents = chunks.map((chunk) => ({
    chunk,
    terms: tokenize(`${chunk.title} ${chunk.category} ${chunk.text}`),
    titleTerms: new Set(tokenize(chunk.title))
  }));
  const averageLength =
    documents.reduce((sum, document) => sum + document.terms.length, 0) /
    Math.max(documents.length, 1);
  const documentFrequency = new Map<string, number>();

  for (const term of queryTerms) {
    documentFrequency.set(
      term,
      documents.filter((document) => document.terms.includes(term)).length
    );
  }

  const intendedCategories = detectIntentCategories(question);
  const hasCertificationIntent = /cert|certificate|certification|credential|course|training|bootcamp/i.test(question);
  const normalizedQuestion = normalizeText(question);
  const rawScores = documents.map((document) => {
    const frequencies = countTerms(document.terms);
    let score = 0;

    for (const term of queryTerms) {
      const frequency = frequencies.get(term) || 0;
      if (frequency === 0) {
        continue;
      }

      const frequencyInDocuments = documentFrequency.get(term) || 0;
      const inverseDocumentFrequency = Math.log(
        1 + (documents.length - frequencyInDocuments + 0.5) / (frequencyInDocuments + 0.5)
      );
      const normalizedFrequency =
        (frequency * 2.2) /
        (frequency + 1.2 * (0.25 + 0.75 * (document.terms.length / Math.max(averageLength, 1))));
      score += inverseDocumentFrequency * normalizedFrequency;

      if (document.titleTerms.has(term)) {
        score += inverseDocumentFrequency * 1.4;
      }
    }

    if (normalizedQuestion.length > 4 && normalizeText(document.chunk.text).includes(normalizedQuestion)) {
      score += 3;
    }

    if (intendedCategories.has(document.chunk.category)) {
      score += 2;
    }

    if (intendedCategories.has("Projects") && document.chunk.category === "Projects") {
      score += 1.5;
    }

    if (!hasCertificationIntent && document.chunk.category === "Certifications") {
      score *= 0.45;
    }

    return { chunk: document.chunk, rawScore: score };
  });
  const maxScore = Math.max(...rawScores.map((candidate) => candidate.rawScore), 0);

  return rawScores
    .filter((candidate) => candidate.rawScore > 0)
    .map(({ chunk, rawScore }) => ({
      chunk,
      score: maxScore > 0 ? rawScore / maxScore : 0
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

export function fuseRankings(
  lexicalCandidates: LexicalCandidate[],
  vectorCandidates: VectorCandidate[],
  limit = FINAL_RESULT_LIMIT
): RankedChunk[] {
  const entries = new Map<string, FusionEntry>();

  lexicalCandidates.forEach((candidate, index) => {
    const entry = getFusionEntry(entries, candidate.chunk);
    entry.score += 1 / (RRF_K + index + 1) + candidate.score * 0.025;
    entry.lexicalScore = Math.max(entry.lexicalScore, candidate.score);
    entry.matchedBy.add("keyword");
  });

  vectorCandidates.forEach((candidate, index) => {
    const entry = getFusionEntry(entries, candidate.chunk);
    entry.score += 1 / (RRF_K + index + 1) + Math.max(candidate.score, 0) * 0.02;
    entry.vectorScore = Math.max(entry.vectorScore ?? 0, candidate.score);
    entry.matchedBy.add("vector");
  });

  const ranked = [...entries.values()].sort((left, right) => right.score - left.score);
  const maxScore = ranked[0]?.score || 1;

  return ranked.slice(0, limit).map((entry) => ({
    ...entry.chunk,
    score: entry.score / maxScore,
    lexicalScore: entry.lexicalScore,
    vectorScore: entry.vectorScore,
    matchedBy: [...entry.matchedBy]
  }));
}

export function prepareEmbeddingQuery(question: string): string {
  return `task: question answering | query: ${expandQuery(question)}`;
}

export function prepareEmbeddingDocument(chunk: RagChunk): string {
  return `title: ${chunk.title || "none"} | text: ${chunk.text}`;
}

export async function embedDocument(chunk: RagChunk, env: Env): Promise<number[]> {
  return embedText(prepareEmbeddingDocument(chunk), env);
}

export function hasUsefulEvidence(result: RetrievalResult): boolean {
  const first = result.chunks[0];
  if (!first) {
    return false;
  }

  return first.lexicalScore >= 0.08 || (first.vectorScore ?? 0) >= 0.58;
}

async function vectorSearch(question: string, chunks: RagChunk[], env: Env): Promise<VectorCandidate[]> {
  const questionVector = await embedText(prepareEmbeddingQuery(question), env);
  const matches = await env.VECTORIZE.query(questionVector, {
    topK: VECTOR_CANDIDATE_LIMIT,
    namespace: VECTOR_NAMESPACE,
    returnMetadata: "none"
  });
  const chunksById = new Map(chunks.map((chunk) => [chunk.id, chunk]));

  return matches.matches
    .map((match) => {
      const chunk = chunksById.get(match.id);
      return chunk ? { chunk, score: match.score } : null;
    })
    .filter((candidate): candidate is VectorCandidate => Boolean(candidate));
}

async function embedText(text: string, env: Env): Promise<number[]> {
  const model = env.GEMINI_EMBEDDING_MODEL || DEFAULT_EMBEDDING_MODEL;
  const endpoint = `${GEMINI_EMBEDDING_BASE_URL}/${model}:embedContent`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": env.GEMINI_API_KEY
    },
    body: JSON.stringify({
      content: {
        parts: [{ text: text.slice(0, 8000) }]
      },
      output_dimensionality: getEmbeddingDimensions(env)
    }),
    signal: AbortSignal.timeout(15_000)
  });

  if (!response.ok) {
    throw new Error(`Gemini embedding failed with status ${response.status}`);
  }

  const data: unknown = await response.json();
  const values = extractEmbeddingValues(data);

  if (values.length !== getEmbeddingDimensions(env)) {
    throw new Error(`Embedding returned ${values.length} dimensions`);
  }

  return values;
}

function extractEmbeddingValues(data: unknown): number[] {
  if (!isRecord(data)) {
    return [];
  }

  const embedding = data.embedding;
  if (isRecord(embedding) && Array.isArray(embedding.values)) {
    return embedding.values.filter((value): value is number => typeof value === "number");
  }

  const embeddings = data.embeddings;
  if (Array.isArray(embeddings) && isRecord(embeddings[0])) {
    const values = embeddings[0].values;
    return Array.isArray(values)
      ? values.filter((value): value is number => typeof value === "number")
      : [];
  }

  return [];
}

function getEmbeddingDimensions(env: Env): number {
  const configured = Number(env.RAG_EMBEDDING_DIMENSIONS);
  return Number.isInteger(configured) && configured >= 128 && configured <= 3072
    ? configured
    : DEFAULT_EMBEDDING_DIMENSIONS;
}

function getFusionEntry(entries: Map<string, FusionEntry>, chunk: RagChunk): FusionEntry {
  const existing = entries.get(chunk.id);
  if (existing) {
    return existing;
  }

  const entry: FusionEntry = {
    chunk,
    score: 0,
    lexicalScore: 0,
    matchedBy: new Set()
  };
  entries.set(chunk.id, entry);
  return entry;
}

function expandQuery(question: string): string {
  const expansions = QUERY_EXPANSIONS.filter(([pattern]) => pattern.test(question)).map(
    ([, expansion]) => expansion
  );
  return [question, ...expansions].join(" ");
}

function detectIntentCategories(question: string): Set<string> {
  return new Set(
    CATEGORY_INTENTS.filter(({ pattern }) => pattern.test(question)).flatMap(
      ({ categories }) => categories
    )
  );
}

function tokenize(value: string): string[] {
  return (normalizeText(value).match(/[a-z0-9][a-z0-9+#.-]*/g) || []).filter(
    (term) => term.length > 1 && !STOP_WORDS.has(term)
  );
}

function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countTerms(terms: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const term of terms) {
    counts.set(term, (counts.get(term) || 0) + 1);
  }
  return counts;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function normalizeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
