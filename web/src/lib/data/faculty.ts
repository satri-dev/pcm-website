// src/lib/data/faculty.ts
// Server-side data access for the public /about/faculty page. Returns faculty
// members grouped by their configured group. Cached with the facultyList tag
// and invalidated from the admin people/faculty API routes.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listFaculty } from "@/repositories/faculty.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { FacultyGroup } from "@/types/faculty";

export interface PublishedFacultyMember {
  id: string;
  name: string;
  role: string;
  group: FacultyGroup;
  photo: string;
}

export interface PublishedFacultyGroups {
  leadership: PublishedFacultyMember[];
  team: PublishedFacultyMember[];
}

export async function getPublishedFaculty(): Promise<PublishedFacultyGroups> {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.facultyList);

  const result = await listFaculty({ pageSize: 100 });
  const items: PublishedFacultyMember[] = result.items.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    group: m.group,
    photo: m.photo,
  }));

  return {
    leadership: items.filter((m) => m.group === "Leadership"),
    team: items.filter((m) => m.group !== "Leadership"),
  };
}
