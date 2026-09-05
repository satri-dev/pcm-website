import PageHeader from "../../_components/dashboard/page-header";
import AlumniManager from "./_components/alumni-manager";
import { getProgramsList } from "@/lib/data/programs";

export const metadata = {
  title: "Alumni Management",
  description:
    "Create, edit, and manage alumni records for Pokhara College of Management website. Control batches, programs, and career details.",
  robots: { index: false, follow: false },
};

export default async function AlumniPage() {
  const programs = await getProgramsList({ pageSize: 100 });
  const programCodes = programs.items.map((p) => p.code);

  return (
    <>
      <PageHeader title="Alumni" subtitle="People · Graduates" />
      <AlumniManager programCodes={programCodes} />
    </>
  );
}
