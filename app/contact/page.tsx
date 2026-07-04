"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", body: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm({ name: "", email: "", body: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Get in touch
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Have a question, feedback, or just want to say hi? Send a message —
          I read every one.
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-10 space-y-4"
      >
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
          required
          className="w-full rounded-lg border border-black/10 bg-white/50 px-4 py-3 text-sm outline-none focus:border-accent dark:border-white/10 dark:bg-white/[0.03]"
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="you@example.com"
          required
          className="w-full rounded-lg border border-black/10 bg-white/50 px-4 py-3 text-sm outline-none focus:border-accent dark:border-white/10 dark:bg-white/[0.03]"
        />
        <textarea
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          placeholder="What's on your mind?"
          required
          rows={5}
          className="w-full rounded-lg border border-black/10 bg-white/50 px-4 py-3 text-sm outline-none focus:border-accent dark:border-white/10 dark:bg-white/[0.03]"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : "Send message"}
          <Send size={16} />
        </button>

        {status === "success" && (
          <p className="text-sm text-emerald-500">
            Thanks — I&apos;ll get back to you soon.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-500">
            Something went wrong. Try again, or email me directly.
          </p>
        )}
      </motion.form>

      <div className="mt-10 flex items-center gap-2 text-sm text-zinc-500">
        <Mail size={16} />
        <a
          href="mailto:ritesh17lifeamazing@gmail.com"
          className="hover:text-accent"
        >
          ritesh17lifeamazing@gmail.com
        </a>
      </div>
    </div>
  );
}
