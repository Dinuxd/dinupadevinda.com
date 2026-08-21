# Portfolio Chat Worker

Cloudflare Worker backend for the static portfolio chatbot. The website remains a Next.js static export on GitHub Pages; only `/chat`, `/health`, and the secured `/admin/reindex` endpoint run on Cloudflare.

## Architecture

```text
Visitor question
-> validation, rate limit, and prompt-injection check
-> Gemini question-answering embedding
-> Cloudflare Vectorize semantic search
-> keyword/BM25-style search over typed portfolio chunks
-> reciprocal-rank fusion
-> top evidence chunks
-> Gemini structured answer
-> citation ID validation
-> answer and clickable portfolio sources
```

If Vectorize is temporarily unavailable, keyword retrieval still answers from the same chunks. The Worker never sends the Gemini key to the browser.

## Important Files

- `src/index.ts` - routes and request orchestration.
- `src/knowledge.ts` - converts `portfolio-chat.json` into typed evidence chunks.
- `src/retrieval.ts` - Gemini embeddings, Vectorize search, keyword ranking, and rank fusion.
- `src/gemini.ts` - grounded prompt, structured output schema, and citation validation input.
- `src/security.ts` - body limits, CORS, prompt-injection checks, and constant-time admin-token verification.
- `wrangler.jsonc` - bindings, public configuration, rate limit, and observability.
- `test/retrieval.test.mjs` - deterministic retrieval and security unit tests.
- `scripts/evaluate-retrieval.mjs` - runs the 20-question offline retrieval evaluation.

## Local Secrets

Create `.dev.vars` from the example and add real values:

```powershell
Copy-Item portfolio-chat-worker\.dev.vars.example portfolio-chat-worker\.dev.vars
```

```text
GEMINI_API_KEY=your_key_here
RAG_ADMIN_TOKEN=a_long_random_value_used_only_for_reindexing
```

Keep `.dev.vars` on your own machine.

## Local Checks

```powershell
pnpm.cmd --dir portfolio-chat-worker types
pnpm.cmd --dir portfolio-chat-worker typecheck
pnpm.cmd --dir portfolio-chat-worker test
pnpm.cmd --dir portfolio-chat-worker eval
pnpm.cmd --dir portfolio-chat-worker deploy:check
```

Run the Worker locally:

```powershell
pnpm.cmd --dir portfolio-chat-worker dev
```

## One-Time Cloudflare Setup

Create a 768-dimension cosine Vectorize index if `portfolio-rag-index` does not already exist:

```powershell
pnpm.cmd --dir portfolio-chat-worker exec wrangler vectorize create portfolio-rag-index --dimensions=768 --metric=cosine
```

Set both secrets interactively:

```powershell
pnpm.cmd --dir portfolio-chat-worker exec wrangler secret put GEMINI_API_KEY
pnpm.cmd --dir portfolio-chat-worker exec wrangler secret put RAG_ADMIN_TOKEN
```

Deploy:

```powershell
pnpm.cmd --dir portfolio-chat-worker exec wrangler deploy
```

## Reindex Portfolio Knowledge

Reindex after the first deployment and whenever `public/portfolio-chat.json` changes. Enter the same value used for `RAG_ADMIN_TOKEN` without writing it into a command or repository file:

```powershell
$adminToken = Read-Host "RAG admin token"
$headers = @{ "x-admin-token" = $adminToken }
Invoke-RestMethod `
  -Method Post `
  -Uri "https://portfolio-chat-worker.dwmddevinda.workers.dev/admin/reindex" `
  -Headers $headers
```

The current namespace is `portfolio-v2`. Document and question embeddings must use the same Gemini Embedding 2 task format, so this reindex is required after deploying this version.

## Verify Deployment

Health:

```powershell
Invoke-RestMethod "https://portfolio-chat-worker.dwmddevinda.workers.dev/health"
```

After reindexing, Vectorize should be reachable and contain portfolio chunks.

Chat:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "https://portfolio-chat-worker.dwmddevinda.workers.dev/chat" `
  -Headers @{ Origin = "https://www.dinupadevinda.com"; "Content-Type" = "application/json" } `
  -Body '{"question":"What computer vision projects has Dinupa built?"}'
```

The response should have `retrievalMode: hybrid`, `grounded: true`, and one or more source objects. If it says `lexical`, the Worker is operating but Vectorize returned no usable candidates; confirm the reindex completed and wait a few seconds for the asynchronous upsert to become queryable.

## Honest Scope

This is a portfolio-scale hybrid RAG assistant. It demonstrates retrieval, grounding, evaluation, serverless deployment, and API security. It is not an enterprise search platform, autonomous agent, or substitute for manual review of Dinupa's CV and project repositories.
