import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import FeedbackManager from "./_components/feedback-manager";
import { listFeedback } from "@/repositories/feedback.repository";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Feedback Management",
  description:
    "Review feedback submissions from the PCM feedback form. Read user responses, ratings, suggestions and manage submissions.",
  robots: { index: false, follow: false },
};

export default async function FeedbackPage() {
  await connection();
  const { items } = await listFeedback({ pageSize: 50 });

  return (
    <>
      <PageHeader title="Feedback" subtitle="Content · Feedback" />
      <FeedbackManager initialData={items} />
    </>
  );
}
