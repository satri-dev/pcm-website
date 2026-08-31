// src/lib/data/chatbot.ts
// Server-side data access for the public chatbot. Uses the Cache Components
// model (ISR/PPR) so the Q&A knowledge base is served from cache instead of
// hitting MongoDB on every request. Admin writes are invalidated from the
// admin API routes via revalidateTag(CACHE_TAGS.chatbot).
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { listChatbotEntries } from "@/repositories/chatbot.repository";

export interface PublicChatbotQa {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
}

export interface PublicChatbotPayload {
  entries: PublicChatbotQa[];
  fallback: PublicChatbotQa | null;
}

export const FALLBACK_QUESTION = "Other";

export async function getPublicChatbotData(): Promise<PublicChatbotPayload> {
  "use cache";
  cacheLife("rarely");
  cacheTag(CACHE_TAGS.chatbot);

  const { items } = await listChatbotEntries({
    pageSize: 500,
    active: true,
    sort: { createdAt: 1 },
  });

  const entries = items
    .filter((item) => item.active && !item.deletedAt)
    .map((item) => ({
      id: item.id,
      question: item.question,
      keywords: item.keywords,
      answer: item.answer,
    }));

  const fallback =
    entries.find(
      (entry) => entry.question.trim().toLowerCase() === FALLBACK_QUESTION.toLowerCase()
    ) ?? null;

  return { entries, fallback };
}
