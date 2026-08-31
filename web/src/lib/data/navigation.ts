// src/lib/data/navigation.ts
// Server-side data access for the public site navigation. The static nav-menu
// structure (labels/hrefs from the nav-menus collection) is cached, but the
// Programs dropdown is filled with a LIVE program query so edits made through
// the admin API (or directly in the DB) show up immediately without restart.
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { listNavMenu } from "@/repositories/nav-menu.repository";
import { getActivePrograms } from "@/lib/data/programs";
import type { NavMenuItem } from "@/types/nav-menu";

export async function getNavMenuItems(): Promise<NavMenuItem[]> {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.navMenu);

  const items = await listNavMenu();
  return items.filter((item) => item.active);
}

export async function getNavbarItems() {
  // The nav-menu structure is cached, and the Programs dropdown is filled from
  // the cached programs list too. Both are tagged for revalidation, so admin
  // edits (nav-menu or program CRUD) invalidate the cache automatically while
  // the navbar stays part of the prerendered static shell.
  const activeItems = await getNavMenuItems();

  // Dynamically populate the Programs dropdown with the cached active programs.
  // getActivePrograms uses "use cache" tagged with programsList, which the admin
  // program CRUD routes revalidateTag on create/update/delete.
  const programsItem = activeItems.find((item) => item.label === "Programs");
  if (programsItem && programsItem.type === "dropdown") {
    const result = await getActivePrograms({ pageSize: 50 });
    const activePrograms = result.items;

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