import { prisma } from "@/lib/prisma";
import { createChatCompletion } from "@/lib/openai";
import { hashContent } from "@/lib/hash";

export async function getPostSummary(slug: string, content: string): Promise<string> {
  const contentHash = hashContent(content);

  const cached = await prisma.postSummary.findUnique({ where: { postSlug: slug } });
  if (cached && cached.contentHash === contentHash) {
    return cached.summary;
  }

  const summary = await createChatCompletion(
    [
      {
        role: "system",
        content:
          "Summarize the given blog post in 2-3 concise sentences for a reader deciding whether to read it. Be specific about what it covers. Do not use phrases like 'this post' or 'this article' — write it as a direct summary.",
      },
      { role: "user", content: content.slice(0, 12000) },
    ],
    150
  );

  await prisma.postSummary.upsert({
    where: { postSlug: slug },
    update: { summary, contentHash },
    create: { postSlug: slug, summary, contentHash },
  });

  return summary;
}
