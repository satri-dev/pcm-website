import type { Metadata } from "next";
import { connection } from "next/server";
import PageHeader from "../../_components/dashboard/page-header";
import ProgramsPageEditor from "./_components/programs-page-editor";
import { getPageContentBySlug } from "@/repositories/page-content.repository";
import { listPrograms } from "@/repositories/programs.repository";

export const metadata: Metadata = {
  title: "Edit Programs Page | Admin",
  description: "Edit the Programs page content including hero, intro, comparison table, and CTA sections.",
  robots: { index: false, follow: false },
};

// Disable instant navigation for admin pages with dynamic content
export const instant = false;

export default async function EditProgramsPage() {
  // Force dynamic rendering for admin pages
  await connection();
  
  // Fetch page content and programs list
  const [pageContent, programsData] = await Promise.all([
    getPageContentBySlug("programs"),
    listPrograms({ pageSize: 100 }),
  ]);

  return (
    <>
      <PageHeader 
        title="Edit Programs Page" 
        subtitle="Content · Pages · Programs" 
      />
      <ProgramsPageEditor 
        initialContent={pageContent}
        availablePrograms={programsData.items}
      />
    </>
  );
}
