import PageHeader from "../../_components/dashboard/page-header";
import DownloadManager from "./_components/download-manager";
import { listDownloads } from "@/repositories/download.repository";

export const metadata = {
  title: "Download Management",
  description:
    "Create, edit, and manage downloadable files for Pokhara College of Management website. Control categories, file uploads, and document organization.",
  robots: { index: false, follow: false },
};

export default async function DownloadPage() {
  const { items } = await listDownloads({ pageSize: 50 });

  return (
    <>
      <PageHeader title="Downloads" subtitle="Media · Files" />
      <DownloadManager initialData={items} />
    </>
  );
}
