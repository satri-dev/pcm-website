import PageHeader from "../../_components/dashboard/page-header";
import FacultyManager from "./_components/faculty-manager";

export const metadata = {
  title: "Faculty Management",
  description:
    "Create, edit, and manage faculty members for Pokhara College of Management website. Control departments, designations, and contact details.",
  robots: { index: false, follow: false },
};

export default async function FacultyPage() {
  return (
    <>
      <PageHeader title="Faculty" subtitle="People · Members" />
      <FacultyManager />
    </>
  );
}
