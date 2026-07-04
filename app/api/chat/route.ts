import { NextRequest } from "next/server";
import { createChatCompletionStream } from "@/lib/openai";
import { getRelevantPosts } from "@/lib/embeddings";

export const maxDuration = 30;

type ChatMessage = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(context: string) {
  return `You are the assistant embedded on "ritesh.dev", a personal software engineering blog. Answer the visitor's question using ONLY the blog post excerpts provided below as context. Always mention which post title(s) you drew the answer from. If the excerpts don't contain the answer, say you don't have a post covering that topic yet instead of making something up. Keep answers concise and conversational.

Context:

${context}`;
}

export async function POST(request: NextRequest) {
  const { messages } = (await request.json()) as { messages: ChatMessage[] };

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMessage || !lastUserMessage.content.trim()) {
    return new Response("Missing question", { status: 400 });
  }

  const question = lastUserMessage.content.trim().slice(0, 1000);
  const relevant = await getRelevantPosts(question, 3);

  const context = relevant
    .map((post) => `### ${post.title} (slug: ${post.slug})\n${post.content.slice(0, 4000)}`)
    .join("\n\n---\n\n");

  const sources = relevant
    .filter((post) => post.score > 0.35)
    .map((post) => ({ slug: post.slug, title: post.title }));

  const trimmedMessages = messages.slice(-10).map((m) => ({
    role: m.role,
    content: m.content.slice(0, 2000),
  }));

  const readable = await createChatCompletionStream(
    [{ role: "system", content: buildSystemPrompt(context) }, ...trimmedMessages],
    500
  );

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Sources": encodeURIComponent(JSON.stringify(sources)),
    },
  });
}
