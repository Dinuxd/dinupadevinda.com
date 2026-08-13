import { env, createExecutionContext, waitOnExecutionContext, SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src/index";

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("TinyStories GPT proxy", () => {
	it("rejects unknown routes", async () => {
		const request = new IncomingRequest("https://example.com/");
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(404);
		expect(await response.json()).toEqual({ error: "Not found" });
	});

	it("returns the same 404 through the integration test harness", async () => {
		const response = await SELF.fetch("https://example.com");

		expect(response.status).toBe(404);
		expect(await response.json()).toEqual({ error: "Not found" });
	});

	it("blocks browser origins outside the portfolio allowlist", async () => {
		const request = new IncomingRequest("https://example.com/generate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Origin: "https://unknown.example",
			},
			body: JSON.stringify({ prompt: "Once upon a time" }),
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(403);
		expect(await response.json()).toEqual({ error: "Origin is not allowed" });
	});

	it("keeps the public generation limit at 160 tokens", async () => {
		const request = new IncomingRequest("https://example.com/generate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Origin: "https://www.dinupadevinda.com",
			},
			body: JSON.stringify({
				prompt: "Once upon a time",
				max_new_tokens: 170,
			}),
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({
			error: "max_new_tokens must be between 20 and 160",
		});
	});
});
