import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import SurveysManager from "./_components/surveys-manager";
import { listSurveys } from "@/repositories/surveys.repository";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Surveys Management",
  description:
    "Create, edit, and manage surveys for Pokhara College of Management website. Control published content, questionnaire building, and survey scheduling.",
  robots: { index: false, follow: false },
};

export default async function SurveysPage() {
  await connection();
  const { items } = await listSurveys({ pageSize: 50 });

  return (
    <>
      <PageHeader title="Surveys" subtitle="Content · Surveys" />
      <SurveysManager initialData={items} />
    </>
  );
}