import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import CampusMapManager from "./_components/campusmap-maager";
import { listCampusMap } from "@/repositories/campus-map.repository";

export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: "Campus Map Management",
  description:
    "Create, edit, and manage campus map landmarks for Pokhara College of Management website.",
  robots: { index: false, follow: false },
};

export default async function CampusMapPage() {
  const { items } = await listCampusMap({ pageSize: 100 });

  return (
    <>
      <PageHeader title="Campus Map" subtitle="Campus · Campus Map" />
      <CampusMapManager initialData={items} />
    </>
  );
}
