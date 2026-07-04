import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { Hero } from "@/components/Hero";
import { PostCard } from "@/components/PostCard";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Latest posts
            </h2>
            <Link
              href="/blog"
              className="group flex items-center gap-1 text-sm font-medium text-accent"
            >
              View all
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.1}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
