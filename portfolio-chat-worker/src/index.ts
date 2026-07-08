type Env = {
  GEMINI_API_KEY: string;
  PORTFOLIO_CONTEXT_URL?: string;
  GEMINI_MODEL?: string;
};

type ChatRequest = {
  question?: unknown;
};

type GeminiContentPart = {
  text?: unknown;
};

type GeminiStep = {
  type?: unknown;
  content?: unknown;
};

const DEFAULT_CONTEXT_URL = "https://www.dinupadevinda.com/portfolio-chat.json";
const DEFAULT_MODEL = "gemini-3.5-flash";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";

const allowedOrigins = new Set([
  "https://www.dinupadevinda.com",
  "https://dinupadevinda.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001"
]);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: origin && allowedOrigins.has(origin) ? 204 : 403,
        headers: corsHeaders(origin)
      });
    }

    if (url.pathname !== "/chat") {
      return jsonResponse({ error: "Not found" }, 404, origin);
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, origin);
    }

    if (!origin || !allowedOrigins.has(origin)) {
      return jsonResponse({ error: "Origin not allowed" }, 403, origin);
    }

    let payload: ChatRequest;

    try {
      payload = (await request.json()) as ChatRequest;
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400, origin);
    }

    const question = typeof payload.question === "string" ? payload.question.trim() : "";

    if (!question) {
      return jsonResponse({ error: "Question is required" }, 400, origin);
    }

    if (question.length > 500) {
      return jsonResponse({ error: "Question is too long" }, 400, origin);
    }

    if (!env.GEMINI_API_KEY) {
      return jsonResponse({ error: "Chat backend is not configured" }, 500, origin);
    }

    try {
      const context = await loadPortfolioContext(env.PORTFOLIO_CONTEXT_URL);
      const prompt = buildPrompt(context, question);
      const answer = await askGemini(prompt, env);

      return jsonResponse(
        {
          answer:
            answer ||
            "The portfolio does not include enough information to answer that clearly.",
          sources: inferSources(question, answer)
        },
        200,
        origin
      );
    } catch {
      return jsonResponse(
        {
          error: "Chat service is temporarily unavailable"
        },
        502,
        origin
      );
    }
  }
};

function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };

  if (origin && allowedOrigins.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function jsonResponse(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin)
    }
  });
}

async function loadPortfolioContext(contextUrl?: string): Promise<string> {
  const response = await fetch(contextUrl || DEFAULT_CONTEXT_URL, {
    cf: {
      cacheEverything: true,
      cacheTtl: 300
    }
  });

  if (!response.ok) {
    throw new Error("Portfolio context could not be loaded");
  }

  const context = await response.text();

  if (context.length > 45000) {
    return context.slice(0, 45000);
  }

  return context;
}

function buildPrompt(context: string, question: string): string {
  return [
    "You are the portfolio assistant for Dinupa Devinda.",
    "Answer only from the portfolio context below.",
    "Keep answers concise, human, and useful for recruiters.",
    "Use plain paragraphs or short bullet lists. Do not use Markdown headings or bold markdown.",
    "Use plain URLs instead of Markdown link syntax.",
    "Do not exaggerate. Do not invent employment, production claims, awards, certifications, or metrics.",
    "If the context does not include the answer, say the portfolio does not include that information.",
    "For questions about this chatbot, RAG, Gemini, Cloudflare Workers, or how you were created, answer from the portfolioAssistant section.",
    "When useful, include GitHub, LinkedIn, CV, or contact email from the context. URLs and email addresses are allowed.",
    "",
    "PORTFOLIO CONTEXT:",
    context,
    "",
    `VISITOR QUESTION: ${question}`,
    "",
    "ANSWER:"
  ].join("\n");
}

async function askGemini(prompt: string, env: Env): Promise<string> {
  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": env.GEMINI_API_KEY
    },
    body: JSON.stringify({
      model: env.GEMINI_MODEL || DEFAULT_MODEL,
      input: prompt
    })
  });

  if (!response.ok) {
    throw new Error("Gemini request failed");
  }

  const data = await response.json();
  return extractGeminiText(data);
}

function extractGeminiText(data: unknown): string {
  if (!data || typeof data !== "object") {
    return "";
  }

  const maybeOutputText = (data as { output_text?: unknown }).output_text;
  if (typeof maybeOutputText === "string") {
    return maybeOutputText.trim();
  }

  const steps = (data as { steps?: unknown }).steps;
  if (!Array.isArray(steps)) {
    return "";
  }

  for (let index = steps.length - 1; index >= 0; index -= 1) {
    const step = steps[index] as GeminiStep;

    if (typeof step.content === "string" && step.content.trim()) {
      return step.content.trim();
    }

    if (Array.isArray(step.content)) {
      const text = step.content
        .map((part: GeminiContentPart) => (typeof part.text === "string" ? part.text : ""))
        .filter(Boolean)
        .join("\n")
        .trim();

      if (text) {
        return text;
      }
    }
  }

  return "";
}

function inferSources(question: string, answer: string): string[] {
  const text = `${question} ${answer}`.toLowerCase();
  const sources: string[] = [];

  if (/(project|github|model|vision|audio|imu|sensor|raspberry|edge|software|backend)/.test(text)) {
    sources.push("Projects");
  }

  if (/(rag|chatbot|assistant|gemini|llm|cloudflare|worker|created|built)/.test(text)) {
    sources.push("Portfolio Assistant");
  }

  if (/(education|degree|sliit|kelaniya|cima|graduand|study)/.test(text)) {
    sources.push("Education");
  }

  if (/(experience|intern|trainee|slt|variosystems|r&d|manufacturing)/.test(text)) {
    sources.push("Experience");
  }

  if (/(certification|certificate|pytorch|opencv|cisco)/.test(text)) {
    sources.push("Certifications");
  }

  if (/(contact|email|linkedin|cv|reach)/.test(text)) {
    sources.push("Contact");
  }

  return sources.length > 0 ? sources : ["Portfolio"];
}
