export type RagChunk = {
  id: string;
  title: string;
  source: string;
  category: string;
  text: string;
  url?: string;
};

export type RankedChunk = RagChunk & {
  score: number;
  lexicalScore: number;
  vectorScore?: number;
  matchedBy: Array<"keyword" | "vector">;
};

export type RetrievalMode = "hybrid" | "lexical";

export type RetrievalResult = {
  mode: RetrievalMode;
  chunks: RankedChunk[];
  diagnostics: {
    lexicalCandidates: number;
    vectorCandidates: number;
  };
};

export type GeneratedAnswer = {
  answer: string;
  grounded: boolean;
  citedSourceIds: string[];
};

export type ChatSource = {
  id: string;
  title: string;
  category: string;
  url?: string;
  preview: string;
};

export type ChatResponse = {
  answer: string;
  grounded: boolean;
  sources: ChatSource[];
  retrievalMode: RetrievalMode | "blocked" | "direct";
};
