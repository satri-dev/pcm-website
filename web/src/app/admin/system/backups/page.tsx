import type { Metadata } from "next";
import { listBackups } from "@/core/lib/backup-utils";
import PageHeader from "../../_components/dashboard/page-header";
import BackupsManager from "./_components/backups-manager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Database Backups",
  description:
    "Export, restore, and manage MongoDB database backups for Pokhara College of Management website. Create JSON snapshots of all collections.",
  robots: { index: false, follow: false },
};

export default async function BackupsPage() {
  const backups = listBackups();

  return (
    <>
      <PageHeader title="Database Backups" subtitle="System · Backups" />
      <BackupsManager initialBackups={backups} />
    </>
  );
}
