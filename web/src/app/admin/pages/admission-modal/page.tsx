import type { Metadata } from "next";
import { connection } from "next/server";
import PageHeader from "../../_components/dashboard/page-header";
import { getAdmissionModal } from "@/repositories/admission-modal.repository";
import AdmissionModalClient from "./_components/admission-modal-client";


export const metadata: Metadata = {
  title: "Admission Modal",
  description: "Configure the admission modal popup on the homepage.",
  robots: { index: false, follow: false },
};

export default async function AdmissionModalPage() {
  await connection();
  const data = await getAdmissionModal();

  return (
    <>
      <PageHeader
        title="Admission Modal"
        subtitle="Pages · Admission Modal"
      />
      <div className="p-6">
        <AdmissionModalClient initialData={data} />
      </div>
    </>
  );
}
