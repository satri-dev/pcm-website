import type { SurveyPageSettings } from "@/types/survey-page-settings";
import type { Survey } from "@/types/surveys";
import { getSurveySettings } from "@/lib/data/survey-page-settings";
import { getPublishedSurveysPage } from "@/lib/data/surveys";
import SurveyClient from "./SurveyClient";

export interface SurveyPageData {
  settings: SurveyPageSettings;
  surveys: Survey[];
  page: number;
  pages: number;
  total: number;
  perPage: number;
}

export default async function SurveyServer({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const settings = await getSurveySettings();
  const perPage = settings.perPage;
  const requested = Math.max(1, parseInt(params?.page ?? "1") || 1);
  const { items, page, pages, total } = await getPublishedSurveysPage(
    requested,
    perPage
  );

  const data: SurveyPageData = {
    settings,
    surveys: items,
    page,
    pages,
    total,
    perPage,
  };

  return <SurveyClient data={data} />;
}
