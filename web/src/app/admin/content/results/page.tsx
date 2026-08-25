import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import ResultsManager from "./_components/results-manager";

export const metadata: Metadata = {
  title: "Results Management",
  description:
    "Create, edit, and manage academic results for Pokhara College of Management website. Control published results by program.",
  robots: { index: false, follow: false },
};

export default function ResultsPage() {
  return (
    <>
      <PageHeader title="Results" subtitle="Content · Results" />
      <ResultsManager />
    </>
  );
}
