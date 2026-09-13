import { Suspense } from "react";
import type { Metadata } from "next";
import { getSurveySettings } from "@/lib/data/survey-page-settings";
import SurveyServer from "./SurveyServer";
import { getCanonicalUrl } from "@/lib/seo-utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSurveySettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    alternates: { canonical: getCanonicalUrl("/survey") },
  };
}

export default function SurveyPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  return (
    <Suspense
      fallback={<div className="sv-page-loading">Loading surveys…</div>}
    >
      <SurveyServer searchParams={searchParams} />
    </Suspense>
  );
}
