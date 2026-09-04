import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import SurveyResponsesManager from "./_components/survey-responses-manager";
import { listSurveyResponseGroups } from "@/repositories/survey-responses.repository";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Survey Responses",
  description:
    "Review and manage public survey submissions for Pokhara College of Management. View responses survey-wise with a full question breakdown.",
  robots: { index: false, follow: false },
};

export default async function SurveyResponsesPage() {
  await connection();
  const { items } = await listSurveyResponseGroups({ pageSize: 100 });

  return (
    <>
      <PageHeader title="Survey Responses" subtitle="Content · Survey Responses" />
      <SurveyResponsesManager initialGroups={items} />
    </>
  );
}
