"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

type Source = { slug: string; title: string };
type ChatMessage = { role: "user" | "assistant"; content: string; sources?: Source[] };

const SUGGESTIONS = [
  "What have you written about Rust?",
  "Explain React Server Components",
  "How do you think about color systems?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage(question: string) {
    if (!question.trim() || streaming) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const sourcesHeader = res.headers.get("X-Sources");
      const sources: Source[] = sourcesHeader
        ? JSON.parse(decodeURIComponent(sourcesHeader))
        : [];

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, content: last.content + chunk };
          return updated;
        });
      }

      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        updated[updated.length - 1] = { ...last, sources };
        return updated;
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Something went wrong. Try again in a moment.",
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        whileTap={{ scale: 0.92 }}
        aria-label={open ? "Close chat" : "Ask about this blog"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg shadow-black/20"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "chat"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            {open ? <X size={22} /> : <MessageCircle size={22} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950"
          >
            <div className="flex items-center gap-2 border-b border-black/5 px-4 py-3 dark:border-white/10">
              <Sparkles size={16} className="text-accent" />
              <p className="text-sm font-semibold">Ask this blog</p>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div>
                  <p className="text-sm text-zinc-500">
                    Ask me anything about the posts on this blog.
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => sendMessage(suggestion)}
                        className="rounded-lg border border-black/10 px-3 py-2 text-left text-xs text-zinc-600 transition-colors hover:border-accent hover:text-accent dark:border-white/10 dark:text-zinc-400"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, i) => (
                <div
                  key={i}
                  className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-black/5 text-zinc-800 dark:bg-white/10 dark:text-zinc-200"
                    }`}
                  >
                    {message.content.length === 0 && streaming && i === messages.length - 1 ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 border-t border-black/10 pt-2 dark:border-white/10">
                        {message.sources.map((source) => (
                          <Link
                            key={source.slug}
                            href={`/blog/${source.slug}`}
                            className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent"
                          >
                            {source.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-black/5 p-3 dark:border-white/10"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={streaming}
                className="flex-1 rounded-full border border-black/10 bg-transparent px-3.5 py-2 text-sm outline-none focus:border-accent disabled:opacity-50 dark:border-white/10"
              />
              <button
                type="submit"
                disabled={streaming || !input.trim()}
                aria-label="Send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
