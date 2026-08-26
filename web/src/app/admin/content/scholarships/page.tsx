import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import ScholarshipsManager from "./_components/scholarships-manager";
import { listScholarships } from "@/repositories/scholarships.repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Scholarships Management",
  description:
    "Create, edit, and manage scholarship schemes for Pokhara College of Management website.",
  robots: { index: false, follow: false },
};

export default async function ScholarshipsPage() {
  const { items } = await listScholarships({ pageSize: 50 });

  return (
    <>
      <PageHeader title="Scholarships" subtitle="Content · Scholarships" />
      <ScholarshipsManager initialData={items} />
    </>
  );
}
