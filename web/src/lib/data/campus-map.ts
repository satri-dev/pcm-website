// src/lib/data/campus-map.ts
// Server-side data access for the public /about/campus-map page. Returns the
// published landmarks from the campus_map collection. Cached with the
// campusMapList tag and invalidated from the admin campus/campus-map API
// routes.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listCampusMap } from "@/repositories/campus-map.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { CampusMapCategory } from "@/app/admin/campus/campus-map/types/campus";

export interface PublishedLandmark {
  id: string;
  name: string;
  category: CampusMapCategory;
  icon: string;
  x: number;
  y: number;
  description: string;
}

export async function getPublishedLandmarks(): Promise<PublishedLandmark[]> {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.campusMapList);

  const result = await listCampusMap({ pageSize: 100, status: "published" });
  return result.items.map((l) => ({
    id: l.id,
    name: l.name,
    category: l.category,
    icon: l.icon,
    x: l.positionX,
    y: l.positionY,
    description: l.description,
  }));
}
