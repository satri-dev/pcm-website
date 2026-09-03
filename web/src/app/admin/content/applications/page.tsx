import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import ApplicationManager from "./_components/application-manager";
import { listApplications } from "@/repositories/application.repository";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Applications Management",
  description:
    "Review admission applications submitted through the PCM website. Track, update status, and manage student applications.",
  robots: { index: false, follow: false },
};

export default async function ApplicationsPage() {
  await connection();
  const { items } = await listApplications({ pageSize: 50 });

  return (
    <>
      <PageHeader title="Applications" subtitle="Content · Applications" />
      <ApplicationManager initialData={items} />
    </>
  );
}
