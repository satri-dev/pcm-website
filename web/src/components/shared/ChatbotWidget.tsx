"use client";

// Public chatbot widget. Cached Q&A knowledge base is loaded once from the
// public /api/chatbot endpoint (backed by the Cache Components/ISR data lib)
// and matched client-side against entry keywords, so answering a question
// never hits MongoDB. If no keyword matches, the answer of the special
// "Other" entry is shown; otherwise a canned "contact us" fallback.

import { useCallback, useEffect, useRef, useState } from "react";
import { BotMessageSquare, Send, X, Bot } from "lucide-react";

interface ChatEntry {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
}

interface ChatPayload {
  entries: ChatEntry[];
  fallback: ChatEntry | null;
}

interface Message {
  id: number;
  role: "user" | "bot";
  text?: string;
  html?: string;
}

const FALLBACK_QUESTION = "other";
const QUICK_REPLIES_VISIBLE = 4;

// Module-scope payload cache so reopening the widget across pages/routes
// doesn't refetch or hammer the server.
let cachedPayload: ChatPayload | null = null;
let cachedAt = 0;
let inflight: Promise<ChatPayload> | null = null;

const DEFAULT_NO_MATCH_HTML = `
  <p><strong>Sorry, I couldn't find an answer to that.</strong></p>
  <p>Try asking about <strong>admissions</strong>, <strong>programs</strong>, <strong>fees</strong> or pick one of the questions above. You can also reach the admission office directly using the contact options on this page.</p>
`;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function keywordScore(entry: ChatEntry, query: string): number {
  const q = query.toLowerCase().trim();
  const qTokens = tokenize(q);
  if (!q) return 0;

  let score = 0;
  for (const raw of entry.keywords) {
    const kw = raw.toLowerCase().trim();
    if (!kw) continue;

    // Exact phrase containment (e.g. "apply" in "how do i apply")
    if (q.includes(kw) || kw.includes(q)) {
      score += 3;
      continue;
    }

    const kwTokens = tokenize(kw);
    for (const kt of kwTokens) {
      if (qTokens.some((qt) => qt === kt)) score += 2;
      else if (qTokens.some((qt) => kt.startsWith(qt) || qt.startsWith(kt)))
        score += 1;
    }
  }
  return score;
}

function findBestMatch(
  entries: ChatEntry[],
  query: string
): ChatEntry | null {
  let best: ChatEntry | null = null;
  let bestScore = 0;
  for (const entry of entries) {
    const q = entry.question.trim().toLowerCase();
    if (q === FALLBACK_QUESTION) continue; // reserved fallback, never matched
    const score = keywordScore(entry, query);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return best;
}

async function loadPayload(): Promise<ChatPayload> {
  if (inflight) return inflight;

  // Reuse the in-memory copy unless it's older than the server's stale window.
  if (cachedPayload && Date.now() - cachedAt < 30 * 60 * 1000) {
    return cachedPayload;
  }

  inflight = fetch("/api/chatbot", { cache: "no-store" })
    .then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as ChatPayload;
    })
    .then((payload) => {
      cachedPayload = payload;
      cachedAt = Date.now();
      return payload;
    })
    .catch(() => {
      cachedPayload = { entries: [], fallback: null };
      cachedAt = Date.now();
      return cachedPayload;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState<ChatPayload | null>(null);
  const [input, setInput] = useState("");
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(0);

  const nextId = () => ++idRef.current;

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    loadPayload().then((data) => {
      if (cancelled) return;
      setPayload(data);
      setMessages((prev) =>
        prev.length === 0
          ? [
              {
                id: nextId(),
                role: "bot",
                html:
                  "<p>Hi! I am the PCM virtual assistant.</p><p>Ask me anything about <strong>admissions</strong>, <strong>programs</strong>, <strong>fees</strong> and more, or pick a question from the list below.</p>",
              },
            ]
          : prev
      );
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const answerQuery = useCallback((query: string) => {
    const trimmed = query.trim();
      if (!trimmed) return;

      const userMessage: Message = {
        id: nextId(),
        role: "user",
        text: trimmed,
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);

      const resolve = (data: ChatPayload) => {
        const matched = findBestMatch(data.entries, trimmed);
        const answer = matched?.answer ?? data.fallback?.answer ?? "";
        const html = answer || DEFAULT_NO_MATCH_HTML;

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "bot",
              html,
            },
          ]);
          setIsTyping(false);
        }, 450);
      };

      if (payload) {
        resolve(payload);
      } else {
        loadPayload().then(resolve);
      }
    },
    [payload]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    answerQuery(input);
  };

  const visibleQuestions = payload?.entries ?? [];
  const cappedQuestions = showAllQuestions
    ? visibleQuestions
    : visibleQuestions.slice(0, QUICK_REPLIES_VISIBLE);
  const loading = isOpen && payload === null;

  return (
    <div className="fixed bottom-6 right-6 z-[150] flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex flex-col w-[min(92vw,370px)] sm:w-[380px] h-[540px] max-h-[calc(100vh-16rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-3 fade-in duration-200">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-pcm-blue text-white shrink-0">
            <div className="relative grid place-items-center w-10 h-10 rounded-full bg-white/15">
              <Bot className="w-6 h-6" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-pcm-green ring-2 ring-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm leading-tight">
                PCM Assistant
              </div>
              <div className="text-xs text-white/80">
                {loading ? "Connecting..." : "Online - reply instantly"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="grid place-items-center w-8 h-8 rounded-full hover:bg-white/15 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-br-sm bg-pcm-blue text-white text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex justify-start">
                  <div className="max-w-[88%] px-3.5 py-3 rounded-2xl rounded-bl-sm bg-white border border-slate-200 text-sm leading-relaxed shadow-sm break-words prose prose-sm prose-slate max-w-none [&_h1]:text-base [&_h1]:font-bold [&_h1]:mb-1 [&_h2]:text-[0.95rem] [&_h2]:font-bold [&_h2]:mb-1 [&_h3]:text-[0.9rem] [&_h3]:font-semibold [&_p]:my-1.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_strong]:font-semibold [&_a]:text-pcm-blue [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: msg.html ?? "" }}
                  />
                </div>
              )
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-slate-200 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:120ms]" />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:240ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {!loading && visibleQuestions.length > 0 && (
            <div className="shrink-0 border-t border-slate-200 bg-white px-3 pt-2 pb-2.5">
              <div className="text-[0.65rem] font-bold uppercase tracking-wide text-slate-400 mb-1.5 px-1">
                Popular questions
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1.5">
                {cappedQuestions.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => answerQuery(entry.question)}
                    className="shrink-0 inline-flex items-center px-3.5 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-pcm-blue hover:border-pcm-blue hover:text-white transition-colors text-[0.8rem] font-medium text-slate-700 whitespace-nowrap"
                  >
                    {entry.question}
                  </button>
                ))}
              </div>
              {visibleQuestions.length > QUICK_REPLIES_VISIBLE && (
                <button
                  type="button"
                  onClick={() => setShowAllQuestions((v) => !v)}
                  className="mt-1 w-full text-center text-[0.72rem] font-semibold text-pcm-blue hover:text-pcm-blue-500 transition-colors"
                >
                  {showAllQuestions
                    ? "Show fewer questions"
                    : `Show more questions (${visibleQuestions.length - QUICK_REPLIES_VISIBLE})`}
                </button>
              )}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="shrink-0 flex items-center gap-2 px-3 py-2.5 bg-white border-t border-slate-200"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              aria-label="Type your question"
              className="flex-1 min-w-0 h-10 px-3.5 rounded-full border border-slate-300 bg-slate-50 text-sm outline-none focus:border-pcm-blue focus:ring-2 focus:ring-pcm-blue/20 transition-shadow"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim()}
              className="grid place-items-center w-10 h-10 rounded-full bg-pcm-blue text-white hover:bg-pcm-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Main toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pcm-blue text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 grid place-items-center"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7" />
        ) : (
          <BotMessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
        )}
      </button>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <div className="pointer-events-none absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pcm-blue animate-ping opacity-20" />
      )}
    </div>
  );
}
