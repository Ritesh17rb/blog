import { prisma } from "@/lib/prisma";
import { createEmbedding } from "@/lib/openai";
import { hashContent } from "@/lib/hash";
import { getAllPosts, getPostSource, type PostMeta } from "@/lib/posts";

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function ensurePostEmbedding(slug: string, content: string): Promise<number[]> {
  const contentHash = hashContent(content);

  const cached = await prisma.postEmbedding.findUnique({ where: { postSlug: slug } });
  if (cached && cached.contentHash === contentHash) {
    return cached.embedding as number[];
  }

  const embedding = await createEmbedding(content.slice(0, 8000));

  await prisma.postEmbedding.upsert({
    where: { postSlug: slug },
    update: { embedding, contentHash },
    create: { postSlug: slug, embedding, contentHash },
  });

  return embedding;
}

export type RelevantPost = PostMeta & { content: string; score: number };

export async function getRelevantPosts(question: string, k = 3): Promise<RelevantPost[]> {
  const posts = getAllPosts();

  const withContent = posts.map((post) => ({
    post,
    content: getPostSource(post.slug).content,
  }));

  const [questionEmbedding, postEmbeddings] = await Promise.all([
    createEmbedding(question),
    Promise.all(withContent.map(({ post, content }) => ensurePostEmbedding(post.slug, content))),
  ]);

  return withContent
    .map(({ post, content }, i) => ({
      ...post,
      content,
      score: cosineSimilarity(questionEmbedding, postEmbeddings[i]),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
