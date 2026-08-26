import PageHeader from "../../_components/dashboard/page-header";
import GalleryManager from "./_components/gallery-manager";
import { listGallery } from "@/repositories/gallery.repository";

export const metadata = {
  title: "Gallery Management",
  description:
    "Create, edit, and manage photo gallery items for Pokhara College of Management website. Control categories, featured images, and album organization.",
  robots: { index: false, follow: false },
};

export default async function GalleryPage() {
  const { items } = await listGallery({ pageSize: 50 });

  return (
    <>
      <PageHeader title="Gallery" subtitle="Media · Photos" />
      <GalleryManager initialData={items} />
    </>
  );
}
