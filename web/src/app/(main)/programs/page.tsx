import type { Metadata } from "next";
import { getProgramsList } from "@/lib/data/programs";
import { getPageContent } from "@/lib/data/page-content";
import ProgramsClient from "./ProgramsClient";
import type { ProgramsPageContent } from "@/types/page-content";

// Programs page now uses cache components for hybrid data (programs + page_content)
export const metadata: Metadata = {
  title: "Programs | BBA, BBA-Finance & BCSIT at PCM Pokhara",
  description:
    "Explore BBA, BBA-Finance and BCSIT degrees at Pokhara College of Management, affiliated to Pokhara University.",
};

export default async function ProgramsPage() {
  // Fetch both data sources in parallel (each has its own cache tag)
  const [pageContentData, programsData] = await Promise.all([
    getPageContent("programs"),
    getProgramsList({ pageSize: 100, status: "open" }),
  ]);

  // Extract content with defaults
  const content = (pageContentData?.content || {}) as Partial<ProgramsPageContent>;
  const programs = programsData.items;

  return (
    <ProgramsClient
      hero={content.hero}
      intro={content.intro}
      comparisonTable={content.comparisonTable}
      cta={content.cta}
      // Show all active programs in the system on the cards + comparison table
      programs={programs}
    />
  );
}
