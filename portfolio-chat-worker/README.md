# Portfolio Chat Worker

Cloudflare Worker backend for the static portfolio chat widget.

## Setup

1. Create a Gemini API key in Google AI Studio.
2. Copy `.dev.vars.example` to `.dev.vars` for local testing.
3. Put the real key in `.dev.vars`:

```txt
GEMINI_API_KEY=<your Gemini API key>
```

4. Run locally:

```powershell
pnpm.cmd --dir portfolio-chat-worker dev
```

5. Add the production secret:

```powershell
pnpm.cmd --dir portfolio-chat-worker exec wrangler secret put GEMINI_API_KEY
```

6. Deploy:

```powershell
pnpm.cmd --dir portfolio-chat-worker deploy
```

7. Build the portfolio with the deployed Worker endpoint:

```powershell
$env:NEXT_PUBLIC_CHAT_API_URL="https://portfolio-chat-worker.<account>.workers.dev/chat"
pnpm.cmd build
```

The portfolio is still a static GitHub Pages export. Only `/chat` runs on Cloudflare Workers.
