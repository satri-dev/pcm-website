import { getResultsSettings } from "@/lib/data/results-page-settings";
import { getPublishedResults } from "@/lib/data/results";
import ResultsClient from "./ResultsClient";

export default async function ResultsServer() {
  const [settings, resultItems] = await Promise.all([
    getResultsSettings(),
    getPublishedResults(),
  ]);
  return <ResultsClient settings={settings} resultItems={resultItems} />;
}
