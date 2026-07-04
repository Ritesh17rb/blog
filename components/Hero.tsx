"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 sm:pt-28">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-sm font-medium text-accent"
      >
        Hey, I&apos;m Ritesh 👋
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl"
      >
        I write code, live life, and{" "}
        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          write about both
        </span>
        .
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 max-w-xl text-lg text-zinc-600 dark:text-zinc-400"
      >
        Notes on software, life, and whatever else I&apos;m currently
        thinking about — not just tech.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 flex flex-wrap items-center gap-4"
      >
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
        >
          Read the blog
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
        <Link
          href="/about"
          className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
        >
          About me
        </Link>
      </motion.div>
    </section>
  );
}
