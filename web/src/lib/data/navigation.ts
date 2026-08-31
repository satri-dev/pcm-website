// src/lib/data/navigation.ts
// Server-side data access for the public site navigation. The static nav-menu
// structure (labels/hrefs from the nav-menus collection) is cached, but the
// Programs dropdown is filled with a LIVE program query so edits made through
// the admin API (or directly in the DB) show up immediately without restart.
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { listNavMenu } from "@/repositories/nav-menu.repository";
import { listPrograms } from "@/repositories/programs.repository";
import type { NavMenuItem } from "@/types/nav-menu";

export async function getNavMenuItems(): Promise<NavMenuItem[]> {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.navMenu);

  const items = await listNavMenu();
  return items.filter((item) => item.active);
}

export async function getNavbarItems() {
  // Not cached on purpose: the Programs dropdown must always reflect the
  // current program records so adds/deletes appear immediately.
  const activeItems = await getNavMenuItems();

  // Dynamically populate the Programs dropdown with live database programs
  const programsItem = activeItems.find((item) => item.label === "Programs");
  if (programsItem && programsItem.type === "dropdown") {
    const result = await listPrograms({ pageSize: 50 });
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