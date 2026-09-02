// src/lib/data/board.ts
// Server-side data access for the public /about/board page. Returns board
// members ordered by their configured priority (order asc). Cached with the
// boardList tag and invalidated from the admin people/board API routes.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listBoard } from "@/repositories/board.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export interface PublishedBoardMember {
  id: string;
  name: string;
  role: string;
  order: number;
  photo: string;
}

export async function getPublishedBoard(): Promise<PublishedBoardMember[]> {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.boardList);

  const result = await listBoard({ pageSize: 50 });
  return result.items.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    order: m.order,
    photo: m.photo,
  }));
}
