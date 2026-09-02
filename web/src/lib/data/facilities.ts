// src/lib/data/facilities.ts
// Server-side data access for the public /about/facility page. Returns the
// published facilities from the facilities collection. Cached with the
// facilitiesList tag and invalidated from the admin campus/facilities API
// routes.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listFacilities } from "@/repositories/facilities.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { FacilityCategory } from "@/app/admin/campus/facilities/types/facilities";

export interface PublishedFacility {
  id: string;
  name: string;
  category: FacilityCategory;
  icon: string;
  image: string;
  description: string;
}

export async function getPublishedFacilities(): Promise<PublishedFacility[]> {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.facilitiesList);

  const result = await listFacilities({ pageSize: 100, status: "published" });
  return result.items.map((f) => ({
    id: f.id,
    name: f.name,
    category: f.category,
    icon: f.icon,
    image: f.image || "/assets/img/about-2.jpg",
    description: f.description,
  }));
}
