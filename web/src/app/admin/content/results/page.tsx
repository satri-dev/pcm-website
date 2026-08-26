import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import ResultsManager from "./_components/results-manager";
import { listResults } from "@/repositories/results.repository";

export const metadata: Metadata = {
  title: "Results Management",
  description:
    "Create, edit, and manage academic results for Pokhara College of Management website. Control published results by program.",
  robots: { index: false, follow: false },
};

export default async function ResultsPage() {
  const { items } = await listResults({ pageSize: 50 });

  return (
    <>
      <PageHeader title="Results" subtitle="Content · Results" />
      <ResultsManager initialData={items} />
    </>
  );
}
