import { prisma } from "@/lib/prisma";
import { createEmbedding } from "@/lib/openai";
import { hashContent } from "@/lib/hash";
import { getKnowledgeDocs, type KnowledgeDoc } from "@/lib/knowledge";

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

// `postSlug` doubles as a generic knowledge-doc id here (post slugs, or "about" / "projects").
async function ensureDocEmbedding(docId: string, content: string): Promise<number[]> {
  const contentHash = hashContent(content);

  const cached = await prisma.postEmbedding.findUnique({ where: { postSlug: docId } });
  if (cached && cached.contentHash === contentHash) {
    return cached.embedding as number[];
  }

  const embedding = await createEmbedding(content.slice(0, 8000));

  await prisma.postEmbedding.upsert({
    where: { postSlug: docId },
    update: { embedding, contentHash },
    create: { postSlug: docId, embedding, contentHash },
  });

  return embedding;
}

export type RelevantDoc = KnowledgeDoc & { score: number };

export async function getRelevantDocs(question: string, k = 3): Promise<RelevantDoc[]> {
  const docs = getKnowledgeDocs();

  const [questionEmbedding, docEmbeddings] = await Promise.all([
    createEmbedding(question),
    Promise.all(docs.map((doc) => ensureDocEmbedding(doc.id, doc.content))),
  ]);

  return docs
    .map((doc, i) => ({
      ...doc,
      score: cosineSimilarity(questionEmbedding, docEmbeddings[i]),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
