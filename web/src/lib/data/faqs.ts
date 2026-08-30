// src/lib/data/faqs.ts
// Server-side data access for the public /faq page FAQ items. Uses the Cache
// Components ISR model so the list is served from cache and only refreshed in
// the background. Written data is invalidated from the admin content API via
// revalidateTag("faqs").
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { listFaqs } from "@/repositories/faqs.repository";

export interface PublicFaqItem {
  id: string;
  num: string;
  category: string;
  question: string;
  answer: string;
}

export async function getPublicFaqs(): Promise<PublicFaqItem[]> {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.faqs);

  const { items } = await listFaqs({
    pageSize: 500,
    sort: { createdAt: 1 },
  });

  return items.map((f, i) => ({
    id: f.id,
    num: String(i + 1).padStart(2, "0"),
    category: f.category,
    question: f.question,
    answer: f.answer,
  }));
}
