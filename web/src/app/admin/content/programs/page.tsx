import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import ProgramsManager from "./_components/programs-manager";

export const metadata: Metadata = {
  title: "Programs Management",
  description:
    "Create, edit, and manage academic programs for Pokhara College of Management website.",
  robots: { index: false, follow: false },
};

export default function ProgramsPage() {
  return (
    <>
      <PageHeader title="Programs" subtitle="Content · Programs" />
      <ProgramsManager />
    </>
  );
}
