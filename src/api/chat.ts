import { api } from "./client";

export type ChatRole = "user" | "assistant" | "system";
export type ChatMessage = { role: ChatRole; content: string };

export async function sendChat(messages: ChatMessage[], signal?: AbortSignal) {
  const res = await api.post<{ reply: string }>(
    "/v1/chat",
    { messages },
    { signal },
  );
  return res.data; // { reply }
}
