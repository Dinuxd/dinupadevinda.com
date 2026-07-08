"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
  sources?: string[];
};

type ChatResponse = {
  answer?: string;
  sources?: string[];
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
          sources: data.sources
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          text: "I could not reach the chat backend right now. Please try again later, or use the contact links on the site."
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

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section
          id="portfolio-chat-panel"
          aria-label="Portfolio chat"
          className="flex h-[min(620px,calc(100vh-7rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-white/15 bg-graphite-950 shadow-2xl shadow-black/70"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-graphite-950 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-signal-cyan/40 bg-signal-cyan/10 text-signal-cyan">
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

          <div className="flex-1 space-y-3 overflow-y-auto bg-graphite-950 px-4 py-4">
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="focus-ring rounded-md border border-white/15 bg-graphite-900 px-3 py-2 text-left text-xs text-slate-200 transition hover:border-signal-cyan/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => void ask(prompt)}
                  disabled={isLoading}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {messages.map((message) => (
              <article
                key={message.id}
                className={[
                  "max-w-[92%] rounded-md border px-3 py-2 text-sm leading-6",
                  message.role === "user"
                    ? "ml-auto border-signal-cyan/40 bg-signal-cyan/15 text-white"
                    : "mr-auto border-white/15 bg-graphite-900 text-slate-100"
                ].join(" ")}
              >
                <FormattedMessage text={message.text} />
                {message.sources && message.sources.length > 0 ? (
                  <p className="mt-2 text-xs text-slate-400">
                    Source: {message.sources.join(", ")}
                  </p>
                ) : null}
              </article>
            ))}

            {isLoading ? (
              <div className="mr-auto flex items-center gap-2 rounded-md border border-white/15 bg-graphite-900 px-3 py-2 text-sm text-slate-300">
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Thinking
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/10 bg-graphite-950 p-3">
            <div className="flex items-end gap-2">
              <label htmlFor="portfolio-chat-question" className="sr-only">
                Ask a question
              </label>
              <textarea
                id="portfolio-chat-question"
                value={input}
                onChange={(event) => setInput(event.target.value.slice(0, 500))}
                placeholder="Ask a portfolio question..."
                rows={2}
                className="focus-ring min-h-11 flex-1 resize-none rounded-md border border-white/15 bg-graphite-900 px-3 py-2 text-sm text-white placeholder:text-slate-500"
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
        className="focus-ring inline-flex h-12 items-center gap-2 rounded-md border border-signal-cyan bg-signal-cyan px-4 text-sm font-semibold text-graphite-950 shadow-2xl shadow-black/30 transition hover:bg-white"
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
