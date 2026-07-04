import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export type PostFrontmatter = {
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  cover?: string;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: string;
};

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostSource(slug: string): { content: string; data: PostFrontmatter } {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);
  return { content, data: data as PostFrontmatter };
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => {
      const { content, data } = getPostSource(slug);
      return {
        slug,
        ...data,
        readingTime: readingTime(content).text,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllPosts().forEach((post) => post.tags?.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

export function getRelatedPosts(slug: string, tags: string[], limit = 3): PostMeta[] {
  return getAllPosts()
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score: post.tags?.filter((tag) => tags.includes(tag)).length ?? 0,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}
