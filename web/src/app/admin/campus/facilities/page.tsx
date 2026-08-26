import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import FacilitiesManager from "./_components/facilities-manager";
import { listFacilities } from "@/repositories/facilities.repository";


export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: "Campus Facilities Management",
  description:
    "Create, edit, and manage campus facilities for Pokhara College of Management website.",
  robots: { index: false, follow: false },
};

export default async function FacilitiesPage() {
  const { items } = await listFacilities({ pageSize: 100 });

  return (
    <>
      <PageHeader title="Campus Facilities" subtitle="Campus · Facilities" />
      <FacilitiesManager initialData={items} />
    </>
  );
}
