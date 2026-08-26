import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import ProgramsManager from "./_components/programs-manager";
import { listPrograms } from "@/repositories/programs.repository";

export const metadata: Metadata = {
  title: "Programs Management",
  description:
    "Create, edit, and manage academic programs for Pokhara College of Management website.",
  robots: { index: false, follow: false },
};

export default async function ProgramsPage() {
  const { items } = await listPrograms({ pageSize: 50 });

  return (
    <>
      <PageHeader title="Programs" subtitle="Content · Programs" />
      <ProgramsManager initialData={items} />
    </>
  );
}
