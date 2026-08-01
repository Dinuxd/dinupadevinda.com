const MAX_REQUEST_BYTES = 8192;
const MAX_QUESTION_CHARS = 500;
const MAX_TURNSTILE_TOKEN_CHARS = 4096;

type TurnstileEnv = Env & {
  TURNSTILE_SECRET_KEY?: string;
};

export const allowedOrigins = new Set([
  "https://www.dinupadevinda.com",
  "https://dinupadevinda.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001"
]);

export type QuestionResult =
  | { ok: true; question: string; turnstileToken?: string }
  | { ok: false; error: string; status: number };

export async function readQuestion(request: Request): Promise<QuestionResult> {
  const contentType = request.headers.get("content-type")?.toLowerCase() || "";
  if (!contentType.startsWith("application/json")) {
    return { ok: false, error: "Content-Type must be application/json", status: 415 };
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return { ok: false, error: "Request body is too large", status: 413 };
  }

  let rawBody: string;
  try {
    rawBody = await readStreamWithLimit(request.body, MAX_REQUEST_BYTES);
  } catch {
    return { ok: false, error: "Request body is too large", status: 413 };
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return { ok: false, error: "Invalid JSON body", status: 400 };
  }

  const question =
    isRecord(payload) && typeof payload.question === "string"
      ? normalizeQuestion(payload.question)
      : "";
  const turnstileToken =
    isRecord(payload) && typeof payload.turnstileToken === "string"
      ? payload.turnstileToken.trim()
      : "";

  if (!question) {
    return { ok: false, error: "Question is required", status: 400 };
  }

  if (question.length > MAX_QUESTION_CHARS) {
    return { ok: false, error: "Question is too long", status: 400 };
  }

  if (turnstileToken.length > MAX_TURNSTILE_TOKEN_CHARS) {
    return { ok: false, error: "Verification token is too long", status: 400 };
  }

  return turnstileToken
    ? { ok: true, question, turnstileToken }
    : { ok: true, question };
}

export function looksLikePromptInjection(question: string): boolean {
  return [
    /ignore (all |any |the )?(previous|prior|above) (instructions|rules|prompt)/i,
    /reveal (the )?(system|developer|hidden) (prompt|message|instructions)/i,
    /(show|print|return|expose).{0,30}(system|developer|hidden) (prompt|message|instructions)/i,
    /(show|print|return|expose).{0,30}(api key|secret|token|credential)/i,
    /(jailbreak|developer mode|bypass (the )?(rules|safety|guardrails))/i,
    /act as (an? )?(unrestricted|different|new) (assistant|ai|model)/i,
    /change (your|the) (role|identity|instructions)/i,
    /repeat.{0,20}(system prompt|instructions above|hidden prompt)/i
  ].some((pattern) => pattern.test(question));
}

export function isGreeting(question: string): boolean {
  return /^(hi|hello|hey|good (morning|afternoon|evening)|what'?s up|sup|how are you|how'?s it going)[!.?\s]*$/i.test(
    question
  );
}

export async function hasValidAdminToken(
  request: Request,
  expectedToken: string
): Promise<boolean> {
  const providedToken = request.headers.get("x-admin-token") || "";
  const encoder = new TextEncoder();
  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(providedToken)),
    crypto.subtle.digest("SHA-256", encoder.encode(expectedToken))
  ]);

  return crypto.subtle.timingSafeEqual(providedHash, expectedHash) && Boolean(providedToken);
}

export function isTurnstileRequired(env: Env): boolean {
  return (env as unknown as { TURNSTILE_REQUIRED?: string }).TURNSTILE_REQUIRED === "true";
}

export async function verifyTurnstileToken(
  token: string | undefined,
  request: Request,
  env: Env
): Promise<boolean> {
  if (!isTurnstileRequired(env)) {
    return true;
  }

  const turnstileEnv = env as TurnstileEnv;
  if (!token || !turnstileEnv.TURNSTILE_SECRET_KEY) {
    return false;
  }

  const form = new FormData();
  form.append("secret", turnstileEnv.TURNSTILE_SECRET_KEY);
  form.append("response", token);

  const remoteIp = request.headers.get("CF-Connecting-IP")?.trim();
  if (remoteIp) {
    form.append("remoteip", remoteIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(5000)
  });

  if (!response.ok) {
    return false;
  }

  const result = await response.json().catch(() => null);
  return isRecord(result) && result.success === true;
}

export function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    Vary: "Origin"
  };

  if (origin && allowedOrigins.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

export async function readStreamWithLimit(
  stream: ReadableStream<Uint8Array> | null,
  maxBytes: number
): Promise<string> {
  if (!stream) {
    return "";
  }

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let output = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel("Body exceeded configured limit");
        throw new Error("Body exceeded configured limit");
      }

      output += decoder.decode(value, { stream: true });
    }

    output += decoder.decode();
    return output;
  } finally {
    reader.releaseLock();
  }
}

function normalizeQuestion(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
