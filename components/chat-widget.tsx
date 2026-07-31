"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { Bot, ExternalLink, FileText, Loader2, MessageCircle, Send, X } from "lucide-react";

type ChatSource = {
  id: string;
  title: string;
  category: string;
  url?: string;
  preview?: string;
};

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
  sources?: ChatSource[];
};

type ChatResponse = {
  answer?: string;
  sources?: Array<ChatSource | string>;
  grounded?: boolean;
  retrievalMode?: "hybrid" | "lexical" | "blocked" | "direct";
  error?: string;
};

const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL ?? "";

const samplePrompts = [
  "What ML projects has Dinupa done?",
  "Does he have computer vision experience?",
  "What is his education background?",
  "How can I contact him?"
];

const initialMessage: ChatMessage = {
  id: 1,
  role: "assistant",
  text: "Hi, I can answer questions about Dinupa's projects, skills, education, experience, and contact details."
};

function FormattedMessage({ text }: { text: string }) {
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    if (isBulletLine(lines[index])) {
      const items: string[] = [];

      while (index < lines.length && isBulletLine(lines[index])) {
        items.push(stripBulletMarker(lines[index]));
        index += 1;
      }

      blocks.push(
        <ul key={`list-${index}`} className="ml-4 list-disc space-y-1">
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInlineText(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (isNumberedLine(lines[index])) {
      const items: string[] = [];

      while (index < lines.length && isNumberedLine(lines[index])) {
        items.push(stripNumberMarker(lines[index]));
        index += 1;
      }

      blocks.push(
        <ol key={`numbered-${index}`} className="ml-4 list-decimal space-y-1">
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInlineText(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    blocks.push(<p key={`line-${index}`}>{renderInlineText(lines[index])}</p>);
    index += 1;
  }

  return <div className="space-y-2">{blocks}</div>;
}

function isBulletLine(line: string) {
  return /^[-*\u2022]\s+/.test(line);
}

function stripBulletMarker(line: string) {
  return line.replace(/^[-*\u2022]\s+/, "");
}

function isNumberedLine(line: string) {
  return /^\d+[.)]\s+/.test(line);
}

function stripNumberMarker(line: string) {
  return line.replace(/^\d+[.)]\s+/, "");
}

function renderInlineText(text: string): ReactNode[] {
  const pattern =
    /(\*\*([^*]+)\*\*|\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)|(https?:\/\/[^\s<]+)|([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}))/gi;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      nodes.push(
        <strong key={`strong-${match.index}`} className="font-semibold text-white">
          {match[2]}
        </strong>
      );
    } else if (match[3] && match[4]) {
      nodes.push(
        <a
          key={`link-${match.index}`}
          href={match[4]}
          target={match[4].startsWith("http") ? "_blank" : undefined}
          rel={match[4].startsWith("http") ? "noopener noreferrer" : undefined}
          className="font-semibold text-signal-cyan underline decoration-signal-cyan/40 underline-offset-4 hover:text-white"
        >
          {match[3]}
        </a>
      );
    } else if (match[5]) {
      const { value, suffix } = trimTrailingPunctuation(match[5]);

      nodes.push(
        <a
          key={`url-${match.index}`}
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-signal-cyan underline decoration-signal-cyan/40 underline-offset-4 hover:text-white"
        >
          {value}
        </a>
      );

      if (suffix) {
        nodes.push(suffix);
      }
    } else if (match[6]) {
      nodes.push(
        <a
          key={`email-${match.index}`}
          href={`mailto:${match[6]}`}
          className="font-semibold text-signal-cyan underline decoration-signal-cyan/40 underline-offset-4 hover:text-white"
        >
          {match[6]}
        </a>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function trimTrailingPunctuation(value: string) {
  const match = value.match(/^(.+?)([),.]+)?$/);

  return {
    value: match?.[1] || value,
    suffix: match?.[2] || ""
  };
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nextId = useRef(2);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  async function ask(question: string) {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isLoading) {
      return;
    }

    setInput("");
    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: "user", text: trimmedQuestion }
    ]);

    if (!chatApiUrl) {
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          text: "The chat backend is not connected yet. You can still review the Projects page, GitHub, LinkedIn, or email Dinupa directly from the Contact page."
        }
      ]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(chatApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: trimmedQuestion })
      });

      const data = (await response.json().catch(() => ({}))) as ChatResponse;

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("RATE_LIMITED");
        }
        throw new Error(data.error || "Chat request failed.");
      }

      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          text:
            data.answer ||
            "I could not find enough portfolio context to answer that clearly.",
          sources: normalizeSources(data.sources)
        }
      ]);
    } catch (error) {
      const rateLimited = error instanceof Error && error.message === "RATE_LIMITED";
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          text: rateLimited
            ? "The chat has received several questions in a short time. Please wait a minute and try again."
            : "I could not reach the chat backend right now. Please try again later, or use the contact links on the site."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void ask(input);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section
          id="portfolio-chat-panel"
          aria-label="Portfolio chat"
          className="flex h-[min(620px,calc(100vh-7rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-cyan-300/20 bg-graphite-950/95 shadow-2xl shadow-black/70 backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between border-b border-cyan-300/12 bg-graphite-950/95 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-signal-cyan/40 bg-signal-cyan/10 text-signal-cyan shadow-glow">
                <Bot aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Ask about Dinupa</p>
                <p className="text-xs text-slate-400">Projects, skills, education, contact</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              className="focus-ring rounded-md p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <div
            className="flex-1 space-y-3 overflow-y-auto bg-graphite-950/95 px-4 py-4"
            aria-live="polite"
          >
            {messages.length === 1 ? (
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="focus-ring rounded-md border border-cyan-300/14 bg-cyan-300/5 px-3 py-2 text-left text-xs text-slate-200 transition hover:border-signal-cyan/70 hover:bg-cyan-300/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => void ask(prompt)}
                    disabled={isLoading}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}

            {messages.map((message) => (
              <article
                key={message.id}
                className={[
                  "max-w-[92%] rounded-md border px-3 py-2 text-sm leading-6",
                  message.role === "user"
                    ? "ml-auto border-signal-cyan/45 bg-signal-cyan/16 text-white shadow-glow"
                    : "mr-auto border-cyan-300/14 bg-graphite-900/95 text-slate-100"
                ].join(" ")}
              >
                <FormattedMessage text={message.text} />
                {message.sources && message.sources.length > 0 ? (
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      <FileText aria-hidden="true" className="h-3.5 w-3.5" />
                      Portfolio sources
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.sources.map((source) =>
                        source.url ? (
                          <a
                            key={source.id}
                            href={source.url}
                            target={source.url.startsWith("http") ? "_blank" : undefined}
                            rel={source.url.startsWith("http") ? "noopener noreferrer" : undefined}
                            title={source.preview}
                            className="focus-ring inline-flex max-w-full items-center gap-1.5 rounded border border-signal-cyan/25 bg-signal-cyan/10 px-2 py-1 text-xs font-medium text-signal-cyan transition hover:border-signal-cyan hover:text-white"
                          >
                            <span className="truncate">{source.title}</span>
                            {source.url.startsWith("http") ? (
                              <ExternalLink aria-hidden="true" className="h-3 w-3 shrink-0" />
                            ) : null}
                          </a>
                        ) : (
                          <span
                            key={source.id}
                            title={source.preview}
                            className="max-w-full truncate rounded border border-cyan-300/12 bg-cyan-300/5 px-2 py-1 text-xs text-slate-300"
                          >
                            {source.title}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ) : null}
              </article>
            ))}

            {isLoading ? (
              <div className="mr-auto flex items-center gap-2 rounded-md border border-cyan-300/14 bg-graphite-900/95 px-3 py-2 text-sm text-slate-300">
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Thinking
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-cyan-300/12 bg-graphite-950/95 p-3">
            <div className="flex items-end gap-2">
              <label htmlFor="portfolio-chat-question" className="sr-only">
                Ask a question
              </label>
              <textarea
                id="portfolio-chat-question"
                value={input}
                onChange={(event) => setInput(event.target.value.slice(0, 500))}
                onKeyDown={handleInputKeyDown}
                placeholder="Ask a portfolio question..."
                rows={2}
                className="focus-ring min-h-11 flex-1 resize-none rounded-md border border-cyan-300/14 bg-graphite-900/95 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                aria-label="Send question"
                className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-signal-cyan bg-signal-cyan text-graphite-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading || !input.trim()}
              >
                <Send aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-right text-xs text-slate-500">{input.length}/500</p>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="focus-ring inline-flex h-12 items-center gap-2 rounded-md border border-signal-cyan bg-gradient-to-r from-signal-cyan to-signal-green px-4 text-sm font-semibold text-graphite-950 shadow-2xl shadow-black/30 transition hover:-translate-y-0.5 hover:from-white hover:to-signal-cyan"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="portfolio-chat-panel"
      >
        <MessageCircle aria-hidden="true" className="h-5 w-5" />
        <span>Ask about my projects</span>
      </button>
    </div>
  );
}

function normalizeSources(sources: ChatResponse["sources"]): ChatSource[] | undefined {
  if (!sources?.length) {
    return undefined;
  }

  return sources.map((source, index) =>
    typeof source === "string"
      ? {
          id: `legacy-source-${index}`,
          title: source,
          category: "Portfolio"
        }
      : source
  );
}
