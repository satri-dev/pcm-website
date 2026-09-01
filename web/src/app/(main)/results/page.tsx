import type { Metadata } from "next";
import { getResultsSettings } from "@/lib/data/results-page-settings";
import ResultsServer from "./ResultsServer";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getResultsSettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    alternates: { canonical: "/results" },
  };
}

export default function ResultsPage() {
  return <ResultsServer />;
}
