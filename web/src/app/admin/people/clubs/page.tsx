import PageHeader from "../../_components/dashboard/page-header";
import ClubsManager from "./_components/clubs-manager";

export const metadata = {
  title: "Clubs Management",
  description:
    "Create, edit, and manage student clubs for Pokhara College of Management website. Control categories, coordinators, and member counts.",
  robots: { index: false, follow: false },
};

export default async function ClubsPage() {
  return (
    <>
      <PageHeader title="Clubs" subtitle="People · Student Organizations" />
      <ClubsManager />
    </>
  );
}
