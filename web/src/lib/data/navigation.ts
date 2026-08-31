// src/lib/data/navigation.ts
// Server-side data access for the public site navigation. Cached with the
// Cache Components model so the header menu (which changes rarely) is served
// from cache instead of hitting MongoDB on every request. Written data is
// invalidated from the admin API routes via revalidateTag(navMenu).
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { listNavMenu } from "@/repositories/nav-menu.repository";
import { getProgramsList } from "@/lib/data/programs";
import type { NavMenuItem } from "@/types/nav-menu";

export async function getNavbarItems() {
  "use cache";
  cacheLife("rarely");
  cacheTag(CACHE_TAGS.navMenu);
  cacheTag(CACHE_TAGS.programsList);

  const items = await listNavMenu();
  const activeItems = items.filter((item) => item.active);

  // Dynamically populate the Programs dropdown with database programs
  const programsItem = activeItems.find((item) => item.label === "Programs");
  if (programsItem && programsItem.type === "dropdown") {
    const result = await getProgramsList({ pageSize: 50 });
    const activePrograms = result.items.filter((p) => p.status === "open");
    
    programsItem.children = [
      { label: "All Programs", href: "/programs" },
      ...activePrograms.map((p) => ({
        label: p.code || p.name,
        href: `/programs/${p.slug}`,
      })),
    ];
  }

  return activeItems;
}