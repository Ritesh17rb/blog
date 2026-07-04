const OPENAI_API_URL = "https://api.openai.com/v1";

export const CHAT_MODEL = "gpt-4o-mini";
export const EMBEDDING_MODEL = "text-embedding-3-small";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function createChatCompletion(
  messages: ChatMessage[],
  maxTokens = 500
): Promise<string> {
  const res = await fetch(`${OPENAI_API_URL}/chat/completions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ model: CHAT_MODEL, messages, max_tokens: maxTokens }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI chat completion failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

export async function createChatCompletionStream(
  messages: ChatMessage[],
  maxTokens = 500
): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch(`${OPENAI_API_URL}/chat/completions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ model: CHAT_MODEL, messages, max_tokens: maxTokens, stream: true }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`OpenAI chat completion failed: ${res.status} ${await res.text()}`);
  }

  const upstream = res.body;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.getReader();
      let buffer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") continue;

          try {
            const json = JSON.parse(payload);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          } catch {
            // Ignore malformed SSE chunk
          }
        }
      }

      controller.close();
    },
  });
}

export async function createEmbedding(input: string): Promise<number[]> {
  const res = await fetch(`${OPENAI_API_URL}/embeddings`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ model: EMBEDDING_MODEL, input }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI embedding failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}
