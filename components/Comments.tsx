"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";

type Comment = { id: string; name: string; body: string; createdAt: string };

export function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => setComments(data.comments ?? []))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, name, body }),
    });
    const data = await res.json();
    setComments((prev) => [data.comment, ...prev]);
    setBody("");
    setSubmitting(false);
  }

  return (
    <section className="mt-16">
      <h2 className="text-xl font-bold tracking-tight">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={60}
          required
          className="w-full rounded-lg border border-black/10 bg-white/50 px-4 py-2.5 text-sm outline-none focus:border-accent dark:border-white/10 dark:bg-white/[0.03]"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your thoughts..."
          maxLength={1000}
          required
          rows={3}
          className="w-full rounded-lg border border-black/10 bg-white/50 px-4 py-2.5 text-sm outline-none focus:border-accent dark:border-white/10 dark:bg-white/[0.03]"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition-opacity disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post comment"}
        </button>
      </form>

      <div className="mt-8 space-y-6">
        {loading && (
          <p className="text-sm text-zinc-500">Loading comments...</p>
        )}
        {!loading && comments.length === 0 && (
          <p className="text-sm text-zinc-500">Be the first to comment.</p>
        )}
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-black/5 p-4 dark:border-white/10"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{comment.name}</p>
              <time className="text-xs text-zinc-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </time>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {comment.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
