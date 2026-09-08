import type { Metadata } from "next";
import { getProgramsList } from "@/lib/data/programs";
import { getPageContent } from "@/lib/data/page-content";
import ProgramsClient from "./ProgramsClient";
import type { ProgramsPageContent } from "@/types/page-content";
import type { Program } from "@/types/programs";

// Type for program coordinator data
interface ProgramCoordinator {
  name: string;
  initials: string;
  image: string;
  role: string;
  quote: string;
}

interface ProgramPageContent {
  coordinator?: ProgramCoordinator;
}

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

  // Featured programs come from the admin page editor (ordered list of slugs),
  // falling back to the three core PCM programs when unset.
  const featuredProgramRefs =
    content.featuredProgramRefs && content.featuredProgramRefs.length > 0
      ? content.featuredProgramRefs
      : ["bcsit", "bba", "bba-finance"];
  const featuredPrograms = featuredProgramRefs
    .map((slug) => programs.find((p) => p.slug === slug))
    .filter((p): p is Program => Boolean(p));

  // Extract coordinator data from programPages nested in the programs page content
  const coordinatorsData = programs.map((program) => {
    const programPageContent = (content as any)?.programPages?.[program.slug];
    
    return {
      programSlug: program.slug,
      programCode: program.code,
      coordinator: programPageContent?.coordinator || null,
    };
  });

  return (
    <ProgramsClient
      hero={content.hero}
      intro={content.intro}
      comparisonTable={content.comparisonTable}
      cta={content.cta}
      coordinatorsContent={content.coordinators}
      // Featured programs drive the cards section; the comparison table and
      // coordinators still show all active programs in the system.
      featuredPrograms={featuredPrograms}
      programs={programs}
      coordinatorsData={coordinatorsData}
    />
  );
}
