import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import FaqsManager from "./_components/faqs-manager";
import { listFaqs } from "@/repositories/faqs.repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQs Management",
  description:
    "Create, edit, and manage frequently asked questions for Pokhara College of Management website.",
  robots: { index: false, follow: false },
};

export default async function FaqsPage() {
  const { items } = await listFaqs({ pageSize: 50 });

  return (
    <>
      <PageHeader title="FAQs" subtitle="Content · FAQs" />
      <FaqsManager initialData={items} />
    </>
  );
}
