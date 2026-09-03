// src/lib/data/clubs.ts
// Server-side data access for the public /clubs page. Returns the clubs from
// the clubs collection. Cached with the clubsList tag and invalidated from the
// admin people/clubs API routes.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listClubs } from "@/repositories/club.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { ClubMember } from "@/types/clubs";

export interface PublishedClub {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  image: string;
  desc: string;
  members: ClubMember[];
}

export async function getPublishedClubs(): Promise<PublishedClub[]> {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.clubsList);

  const result = await listClubs({ pageSize: 100 });
  return result.items.map((c) => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    tagline: c.tagline,
    image: c.image,
    desc: c.desc,
    members: c.members,
  }));
}
