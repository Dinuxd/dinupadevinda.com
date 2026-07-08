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

type PortfolioData = {
  profile?: {
    role?: string;
    headline?: string;
    summary?: string;
    contact?: Record<string, string>;
  };
  strengths?: string[];
  education?: Array<{
    degree?: string;
    institution?: string;
    period?: string;
    notes?: string;
    subjectCombination?: string;
  }>;
  experience?: Array<{
    role?: string;
    organization?: string;
    period?: string;
    summary?: string;
  }>;
  projects?: Array<{
    title?: string;
    type?: string;
    summary?: string;
    areas?: string[];
    stack?: string[];
    link?: string;
  }>;
  certifications?: Array<{
    title?: string;
    issuer?: string;
    issued?: string;
    credentialUrl?: string;
  }>;
  portfolioAssistant?: {
    shortAnswer?: string;
    knowledgeFile?: string;
    technologies?: string[];
    honestyNote?: string;
  };
};

type FallbackAnswer = {
  answer: string;
  sources: string[];
};

const DEFAULT_CONTEXT_URL = "https://www.dinupadevinda.com/portfolio-chat.json";
const DEFAULT_MODEL = "gemini-3.1-flash-lite";
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
      let answer = "";

      try {
        answer = await askGemini(prompt, env);
      } catch (error) {
        console.warn("Gemini unavailable; using fallback answer", normalizeError(error));
        const fallback = buildFallbackAnswer(context, question);

        return jsonResponse(
          {
            answer: fallback.answer,
            sources: fallback.sources
          },
          200,
          origin
        );
      }

      return jsonResponse(
        {
          answer:
            answer || buildFallbackAnswer(context, question).answer,
          sources: inferSources(question, answer)
        },
        200,
        origin
      );
    } catch (error) {
      console.error("Chat request failed", normalizeError(error));

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

function buildFallbackAnswer(context: string, question: string): FallbackAnswer {
  const data = parsePortfolioData(context);
  const lowerQuestion = question.toLowerCase();

  if (/^(hi|hello|hey|yo)\b/.test(lowerQuestion)) {
    return {
      answer:
        "Hi, I can answer questions about Dinupa's projects, education, experience, skills, certifications, and contact details.",
      sources: ["Portfolio"]
    };
  }

  if (/(chatbot|rag|gemini|cloudflare|worker|assistant|how.*created|how.*built)/.test(lowerQuestion)) {
    const assistant = data.portfolioAssistant;
    const technologies = assistant?.technologies?.slice(0, 5).join(", ");

    return {
      answer: [
        assistant?.shortAnswer ||
          "This portfolio assistant uses a static portfolio knowledge file and a serverless backend.",
        assistant?.knowledgeFile ? `Knowledge file: ${assistant.knowledgeFile}.` : "",
        technologies ? `Technologies: ${technologies}.` : "",
        assistant?.honestyNote || ""
      ]
        .filter(Boolean)
        .join("\n"),
      sources: ["Portfolio Assistant"]
    };
  }

  if (/(contact|email|linkedin|github|cv|reach|phone)/.test(lowerQuestion)) {
    const contact = data.profile?.contact || {};

    return {
      answer: [
        "The main contact links are:",
        contact.email ? `- Email: ${contact.email}` : "",
        contact.linkedin ? `- LinkedIn: ${contact.linkedin}` : "",
        contact.github ? `- GitHub: ${contact.github}` : "",
        contact.cv ? `- CV: ${contact.cv}` : ""
      ]
        .filter(Boolean)
        .join("\n"),
      sources: ["Contact"]
    };
  }

  if (/(education|degree|sliit|kelaniya|cima|study|studied|background)/.test(lowerQuestion)) {
    return {
      answer: formatListAnswer(
        "Dinupa's education background includes:",
        data.education?.map((item) =>
          `${item.degree || "Degree"} at ${item.institution || "institution"}${
            item.period ? ` (${item.period})` : ""
          }${item.subjectCombination ? `. ${item.subjectCombination}` : ""}`
        )
      ),
      sources: ["Education"]
    };
  }

  if (/(experience|intern|trainee|slt|variosystems|r&d|manufacturing|work)/.test(lowerQuestion)) {
    return {
      answer: formatListAnswer(
        "Dinupa's experience includes:",
        data.experience?.map((item) =>
          `${item.role || "Role"} at ${item.organization || "organization"}${
            item.period ? ` (${item.period})` : ""
          }. ${item.summary || ""}`.trim()
        )
      ),
      sources: ["Experience"]
    };
  }

  if (/(certificate|certification|pytorch|opencv|cisco|cima|credential)/.test(lowerQuestion)) {
    return {
      answer: formatListAnswer(
        "Relevant certifications include:",
        data.certifications
          ?.slice(0, 6)
          .map((item) => `${item.title || "Certification"} - ${item.issuer || "issuer"}${item.issued ? ` (${item.issued})` : ""}`)
      ),
      sources: ["Certifications"]
    };
  }

  if (/(vision|computer vision|yolo|opencv|image|camera)/.test(lowerQuestion)) {
    return {
      answer: formatProjectAnswer(
        "Yes. The strongest computer vision related projects are:",
        filterProjects(data.projects, ["vision", "yolo", "opencv", "camera", "image"])
      ),
      sources: ["Projects"]
    };
  }

  if (/(audio|horn|sound|cnn|log-mel|crash)/.test(lowerQuestion)) {
    return {
      answer: formatProjectAnswer(
        "Audio ML appears in these projects:",
        filterProjects(data.projects, ["audio", "horn", "sound", "log-mel", "crash"])
      ),
      sources: ["Projects"]
    };
  }

  if (/(imu|sensor|driving|lane|aggressive|fusion)/.test(lowerQuestion)) {
    return {
      answer: formatProjectAnswer(
        "Sensor and IMU related projects include:",
        filterProjects(data.projects, ["imu", "sensor", "driving", "lane", "fusion"])
      ),
      sources: ["Projects"]
    };
  }

  if (/(project|ml|machine learning|ai|strongest|best|portfolio|github)/.test(lowerQuestion)) {
    return {
      answer: formatProjectAnswer(
        "Some of Dinupa's main ML and engineering projects are:",
        data.projects?.slice(0, 6)
      ),
      sources: ["Projects"]
    };
  }

  if (/(skill|stack|technology|tools|python|tensorflow|pytorch)/.test(lowerQuestion)) {
    return {
      answer: formatListAnswer("Main strengths listed in the portfolio:", data.strengths),
      sources: ["Portfolio"]
    };
  }

  return {
    answer:
      "The portfolio does not include enough information to answer that clearly. You can ask about Dinupa's projects, education, experience, skills, certifications, or contact details.",
    sources: ["Portfolio"]
  };
}

function parsePortfolioData(context: string): PortfolioData {
  try {
    return JSON.parse(context) as PortfolioData;
  } catch {
    return {};
  }
}

function formatListAnswer(intro: string, items?: string[]): string {
  const validItems = (items || []).filter(Boolean);

  if (validItems.length === 0) {
    return "The portfolio does not include enough information to answer that clearly.";
  }

  return [intro, ...validItems.map((item) => `- ${item}`)].join("\n");
}

function filterProjects(projects: PortfolioData["projects"], keywords: string[]) {
  return projects?.filter((project) => {
    const text = [
      project.title,
      project.type,
      project.summary,
      project.areas?.join(" "),
      project.stack?.join(" ")
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return keywords.some((keyword) => text.includes(keyword));
  });
}

function formatProjectAnswer(intro: string, projects?: PortfolioData["projects"]): string {
  const selectedProjects = (projects || []).slice(0, 5);

  if (selectedProjects.length === 0) {
    return "The portfolio does not include enough project information to answer that clearly.";
  }

  return [
    intro,
    ...selectedProjects.map((project) => {
      const link = project.link ? ` ${project.link}` : "";
      return `- ${project.title || "Project"}: ${project.summary || project.type || "Project details are listed in the portfolio."}${link}`;
    })
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
    const message = await response.text().catch(() => "");
    throw new Error(`Gemini request failed with ${response.status}: ${message.slice(0, 500)}`);
  }

  const data = await response.json();
  return extractGeminiText(data);
}

function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
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

  if (/(education|degree|sliit|kelaniya|cima|study)/.test(text)) {
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
