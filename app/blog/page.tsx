import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { BlogList } from "@/components/BlogList";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "All posts on software engineering, design systems, and building things.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Reveal>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Blog
        </h1>
        <p className="mt-3 max-w-xl text-zinc-600 dark:text-zinc-400">
          {posts.length} posts on backend engineering, frontend craft, and
          design systems.
        </p>
      </Reveal>
      <div className="mt-10">
        <BlogList posts={posts} tags={tags} />
      </div>
    </div>
  );
}
