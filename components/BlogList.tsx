"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { PostCard } from "./PostCard";
import type { PostMeta } from "@/lib/posts";

export function BlogList({ posts, tags }: { posts: PostMeta[]; tags: string[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const fuse = useMemo(
    () => new Fuse(posts, { keys: ["title", "excerpt", "tags"], threshold: 0.35 }),
    [posts]
  );

  const filtered = useMemo(() => {
    let result = query ? fuse.search(query).map((r) => r.item) : posts;
    if (activeTag) {
      result = result.filter((post) => post.tags?.includes(activeTag));
    }
    return result;
  }, [query, activeTag, fuse, posts]);

  return (
    <div>
      <div className="relative mb-6">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          size={16}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full rounded-full border border-black/10 bg-white/50 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-accent dark:border-white/10 dark:bg-white/[0.03]"
        />
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTag(null)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            activeTag === null
              ? "bg-foreground text-background"
              : "bg-black/5 text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            type="button"
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTag === tag
                ? "bg-foreground text-background"
                : "bg-black/5 text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-500">No posts match your search.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
