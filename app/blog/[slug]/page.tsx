import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import readingTime from "reading-time";
import {
  getPostSlugs,
  getPostSource,
  getRelatedPosts,
} from "@/lib/posts";
import { extractToc } from "@/lib/toc";
import { getPostSummary } from "@/lib/summary";
import { MDXContent } from "@/lib/mdx";
import { Sparkles } from "lucide-react";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TableOfContents } from "@/components/TableOfContents";
import { LikeButton } from "@/components/LikeButton";
import { Comments } from "@/components/Comments";
import { PostCard } from "@/components/PostCard";

type Params = { slug: string };

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = getPostSource(slug);
    return {
      title: data.title,
      description: data.excerpt,
      openGraph: {
        title: data.title,
        description: data.excerpt,
        images: data.cover ? [data.cover] : undefined,
        type: "article",
        publishedTime: data.date,
      },
    };
  } catch {
    return {};
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  let content: string;
  let data: ReturnType<typeof getPostSource>["data"];
  try {
    ({ content, data } = getPostSource(slug));
  } catch {
    notFound();
  }

  const toc = extractToc(content);
  const related = getRelatedPosts(slug, data.tags ?? []);
  const time = readingTime(content).text;

  let summary: string | null = null;
  try {
    summary = await getPostSummary(slug, content);
  } catch (error) {
    console.error(`Failed to generate summary for "${slug}"`, error);
  }

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-5xl px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {data.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {data.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-zinc-500">
            <time dateTime={data.date}>
              {new Date(data.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{time}</span>
          </div>
        </div>

        {data.cover && (
          <div className="relative mx-auto mt-10 aspect-[1200/630] w-full max-w-4xl overflow-hidden rounded-2xl">
            <Image
              src={data.cover}
              alt={data.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {summary && (
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-accent/20 bg-accent/5 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-accent">
              <Sparkles size={16} />
              TL;DR
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {summary}
            </p>
          </div>
        )}

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-[1fr_220px]">
          <div className="prose prose-zinc max-w-none dark:prose-invert prose-a:text-accent prose-headings:scroll-mt-24">
            <MDXContent source={content} />

            <div className="not-prose mt-10 flex items-center gap-4">
              <LikeButton slug={slug} />
            </div>

            <Comments slug={slug} />
          </div>

          <TableOfContents items={toc} />
        </div>

        {related.length > 0 && (
          <div className="mx-auto mt-20 max-w-5xl">
            <h2 className="text-xl font-bold tracking-tight">
              Related posts
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
