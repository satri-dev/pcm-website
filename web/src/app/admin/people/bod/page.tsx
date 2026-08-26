import PageHeader from "../../_components/dashboard/page-header";
import BodManager from "./_components/bod-manager";

export const metadata = {
  title: "Board of Directors Management",
  description:
    "Create, edit, and manage Board of Directors members for Pokhara College of Management website.",
  robots: { index: false, follow: false },
};

export default async function BodPage() {
  return (
    <>
      <PageHeader title="Board of Directors" subtitle="People · Leadership" />
      <BodManager />
    </>
  );
}
