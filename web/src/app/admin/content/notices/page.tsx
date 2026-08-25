import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import NoticesManager from "./_components/notices-manager";

export const metadata: Metadata = {
  title: "Notices Management",
  description:
    "Create, edit, and manage official notices for Pokhara College of Management website. Control published notices, circulars, and announcements.",
  robots: { index: false, follow: false },
};

export default function NoticesPage() {
  return (
    <>
      <PageHeader title="Notices" subtitle="Content · Notices" />
      <NoticesManager />
    </>
  );
}
