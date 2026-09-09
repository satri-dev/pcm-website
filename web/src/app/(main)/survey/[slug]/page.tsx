import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPublishedSurveyBySlugCached,
  getPublishedSurveys,
} from "@/lib/data/surveys";
import { getSurveySettings } from "@/lib/data/survey-page-settings";
import { BUILD_PLACEHOLDER_SLUG } from "@/lib/constants";
import SurveyResponder from "./SurveyResponder";

export async function generateStaticParams() {
  try {
    const items = await getPublishedSurveys();
    if (items.length === 0) return [{ slug: BUILD_PLACEHOLDER_SLUG }];
    return items.map((s) => ({ slug: s.slug }));
  } catch (error) {
    console.warn("Failed to generate static params for surveys:", error);
    return [{ slug: BUILD_PLACEHOLDER_SLUG }];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const survey = await getPublishedSurveyBySlugCached(slug);
  if (!survey) return {};
  return {
    title: survey.seo?.title || `${survey.title} | Surveys & Polls | PCM`,
    description: survey.seo?.description || survey.excerpt,
    keywords: survey.seo?.keywords,
    alternates: { canonical: `/survey/${slug}` },
  };
}

export default async function SurveyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [survey, settings] = await Promise.all([
    getPublishedSurveyBySlugCached(slug),
    getSurveySettings(),
  ]);
  if (!survey) notFound();

  return (
    <div className="pcm-survey">
      <section className="section">
        <div className="wrap-wide sv-form-wrap">
          <SurveyResponder survey={survey} settings={settings} />
        </div>
      </section>
    </div>
  );
}
