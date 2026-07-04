import { NextRequest } from "next/server";
import { createChatCompletionStream } from "@/lib/openai";
import { getRelevantDocs } from "@/lib/embeddings";

export const maxDuration = 30;

type ChatMessage = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(context: string) {
  return `You are the assistant embedded on "ritesh.dev", Ritesh's personal blog covering software, life, and whatever else he's currently thinking about — it's not limited to tech. Answer the visitor's question using ONLY the excerpts provided below as context, which may include blog posts as well as his About and Projects pages. Always mention which piece(s) you drew the answer from. If the excerpts don't contain the answer, say you don't have anything covering that topic yet instead of making something up. Keep answers concise and conversational.

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
  const relevant = await getRelevantDocs(question, 3);

  const context = relevant
    .map((doc) => `### ${doc.title}\n${doc.content.slice(0, 4000)}`)
    .join("\n\n---\n\n");

  const sources = relevant
    .filter((doc) => doc.score > 0.35)
    .map((doc) => ({ url: doc.url, title: doc.title }));

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
