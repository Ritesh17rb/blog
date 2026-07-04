"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch(`/api/likes?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(0));
  }, [slug]);

  async function handleLike() {
    if (liked) return;
    setLiked(true);
    setCount((prev) => (prev ?? 0) + 1);
    await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={liked}
      className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 disabled:cursor-default dark:border-white/10 dark:hover:bg-white/10"
    >
      <motion.span whileTap={{ scale: 1.3 }} className="flex">
        <Heart size={16} className={liked ? "fill-pink-500 text-pink-500" : ""} />
      </motion.span>
      {count === null ? "…" : count}
    </button>
  );
}
