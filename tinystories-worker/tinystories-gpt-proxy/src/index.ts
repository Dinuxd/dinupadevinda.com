interface Env {
	STORY_API_URL: string;
	STORY_API_KEY: string;
}

type GenerateRequest = {
	prompt?: unknown;
	temperature?: unknown;
	top_k?: unknown;
	max_new_tokens?: unknown;
	seed?: unknown;
};

const allowedOrigins = new Set([
	"https://www.dinupadevinda.com",
	"https://dinupadevinda.com",
	"http://localhost:3000",
	"http://127.0.0.1:3000",
	"http://192.168.1.9:3000",
]);

function corsHeaders(origin: string | null) {
	const headers = new Headers({
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "86400",
		"Vary": "Origin",
	});

	if (origin && allowedOrigins.has(origin)) {
		headers.set("Access-Control-Allow-Origin", origin);
	}

	return headers;
}

function jsonResponse(
	body: unknown,
	status: number,
	origin: string | null,
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			...Object.fromEntries(corsHeaders(origin)),
			"Content-Type": "application/json; charset=utf-8",
			"X-Content-Type-Options": "nosniff",
		},
	});
}

function reject(message: string, status: number, origin: string | null): Response {
	return jsonResponse({ error: message }, status, origin);
}

function readNumber(
	value: unknown,
	fallback: number,
	minimum: number,
	maximum: number,
	name: string,
): number {
	if (value === undefined || value === null || value === "") {
		return fallback;
	}

	if (typeof value !== "number" || !Number.isFinite(value)) {
		throw new Error(`${name} must be a number`);
	}

	if (value < minimum || value > maximum) {
		throw new Error(`${name} must be between ${minimum} and ${maximum}`);
	}

	return value;
}

function normalizeRequest(body: GenerateRequest) {
	const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

	if (!prompt) {
		throw new Error("prompt is required");
	}

	if (prompt.length > 512) {
		throw new Error("prompt must be 512 characters or less");
	}

	return {
		prompt,
		temperature: readNumber(body.temperature, 0.8, 0.2, 1.5, "temperature"),
		top_k: Math.round(readNumber(body.top_k, 40, 1, 100, "top_k")),
		max_new_tokens: Math.round(
			readNumber(body.max_new_tokens, 80, 20, 160, "max_new_tokens"),
		),
		seed: Math.round(readNumber(body.seed, 42, 0, 999999, "seed")),
	};
}

const worker = {
	async fetch(request: Request, env: Env): Promise<Response> {
		const origin = request.headers.get("Origin");

		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: corsHeaders(origin),
			});
		}

		if (origin && !allowedOrigins.has(origin)) {
			return reject("Origin is not allowed", 403, origin);
		}

		const url = new URL(request.url);
		if (url.pathname !== "/generate") {
			return reject("Not found", 404, origin);
		}

		if (request.method !== "POST") {
			return reject("Method not allowed", 405, origin);
		}

		const contentType = request.headers.get("Content-Type") ?? "";
		if (!contentType.includes("application/json")) {
			return reject("Content-Type must be application/json", 415, origin);
		}

		let payload;
		try {
			payload = normalizeRequest((await request.json()) as GenerateRequest);
		} catch (error) {
			return reject(
				error instanceof Error ? error.message : "Invalid request",
				400,
				origin,
			);
		}

		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 30_000);

		try {
			const upstream = await fetch(env.STORY_API_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Demo-Api-Key": env.STORY_API_KEY,
				},
				body: JSON.stringify(payload),
				signal: controller.signal,
			});

			const text = await upstream.text();
			return new Response(text, {
				status: upstream.status,
				headers: {
					...Object.fromEntries(corsHeaders(origin)),
					"Content-Type":
						upstream.headers.get("Content-Type") ??
						"application/json; charset=utf-8",
					"X-Content-Type-Options": "nosniff",
				},
			});
		} catch {
			return reject("Story generator is temporarily unavailable", 502, origin);
		} finally {
			clearTimeout(timeout);
		}
	},
};

export default worker;
