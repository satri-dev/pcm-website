import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import NoticesManager from "./_components/notices-manager";
import { listNotices } from "@/repositories/notices.repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notices Management",
  description:
    "Create, edit, and manage official notices for Pokhara College of Management website. Control published notices, circulars, and announcements.",
  robots: { index: false, follow: false },
};

export default async function NoticesPage() {
  const { items } = await listNotices({ pageSize: 50 });

  return (
    <>
      <PageHeader title="Notices" subtitle="Content · Notices" />
      <NoticesManager initialData={items} />
    </>
  );
}
