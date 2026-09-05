import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import ResultsManager from "./_components/results-manager";
import { listResults } from "@/repositories/results.repository";
import { getProgramsList } from "@/lib/data/programs";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Results Management",
  description:
    "Create, edit, and manage academic results for Pokhara College of Management website. Control published results by program.",
  robots: { index: false, follow: false },
};

export default async function ResultsPage() {
  await connection();
  const [{ items }, programs] = await Promise.all([
    listResults({ pageSize: 50 }),
    getProgramsList({ pageSize: 50 }),
  ]);
  const programCodes = programs.items.map((p) => p.code);

  return (
    <>
      <PageHeader title="Results" subtitle="Content · Results" />
      <ResultsManager initialData={items} programCodes={programCodes} />
    </>
  );
}
