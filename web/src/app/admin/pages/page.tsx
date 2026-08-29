import type { Metadata } from "next";

import PageHeader from "../_components/dashboard/page-header";
import NavMenuManager from "./_components/nav-menu-manager";
import {
  ensureNavMenusReady,
  listNavMenu,
} from "@/repositories/nav-menu.repository";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Pages & Sections · Navbar",
  description:
    "Manage the website navigation bar. Create, edit, reorder, and hide menu items that appear on the public website header.",
  robots: { index: false, follow: false },
};

export default async function PagesPage() {
  await connection();
  await ensureNavMenusReady();
  const items = await listNavMenu();

  return (
    <>
      <PageHeader title="Pages & Sections" subtitle="Overview · Navbar menus" />
      <NavMenuManager initialData={items} />
    </>
  );
}