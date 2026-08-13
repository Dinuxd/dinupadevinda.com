# Dinupa Devinda Portfolio

Static Next.js portfolio for machine learning, AI/ML, R&D, software, and engineering projects.

Live site:

https://www.dinupadevinda.com/

## What Is Included

- Static-export Next.js App Router site
- Typed project, experience, certification, and profile content
- Portfolio RAG assistant powered by Cloudflare Workers, Gemini, and Vectorize
- TinyStories GPT demo UI connected to a Cloudflare Worker proxy
- Static assets synced from `data/` into `public/data/`
- GitHub Pages friendly build with `output: "export"`

## Main Commands

```powershell
pnpm.cmd install
pnpm.cmd lint
pnpm.cmd build
pnpm.cmd dev -p 3000
```

## Worker Projects

Portfolio chatbot Worker:

```powershell
pnpm.cmd --dir portfolio-chat-worker typecheck
pnpm.cmd --dir portfolio-chat-worker test
```

TinyStories GPT proxy Worker:

```powershell
pnpm.cmd --dir tinystories-worker\tinystories-gpt-proxy typecheck
pnpm.cmd --dir tinystories-worker\tinystories-gpt-proxy test
```

## Notes

Secrets are stored in Cloudflare Worker secrets and local `.env` files only. Do not commit `.env.local`, `.dev.vars`, model checkpoints, or generated dependency/build folders.
