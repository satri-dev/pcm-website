// src/lib/data/messages.ts
// Server-side data access for the public /about/message page. Returns the
// leadership messages from the messages collection. Cached with the
// messageList tag and invalidated from the admin people/messages API routes.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listMessages } from "@/repositories/message.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export interface PublishedMessage {
  id: string;
  title: string;
  author: string;
  role: string;
  text: string;
  photo: string;
}

export async function getPublishedMessages(): Promise<PublishedMessage[]> {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.messageList);

  const result = await listMessages({ pageSize: 100 });
  return result.items.map((m) => ({
    id: m.id,
    title: m.title,
    author: m.author,
    role: m.role,
    text: m.excerpt,
    photo: m.photo,
  }));
}
