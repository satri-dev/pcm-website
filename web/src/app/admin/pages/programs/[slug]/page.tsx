// src/app/admin/pages/programs/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getProgramBySlug } from "@/lib/data/programs";
import { getPageContent } from "@/lib/data/page-content";
import PageHeader from "../../../_components/dashboard/page-header";
import ProgramPageEditor, {
  type ProgramPageContent,
} from "./_components/program-page-editor";

// Disable instant navigation for admin pages with dynamic content
export const instant = false;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  return {
    title: program ? `${program.name} Page Content | Admin` : "Program Page | Admin",
    robots: { index: false, follow: false },
  };
}

export default async function IndividualProgramPage({ params }: Props) {
  // Force dynamic rendering for admin pages
  await connection();

  const { slug } = await params;

  // Get the program from database
  const program = await getProgramBySlug(slug);
  if (!program) {
    notFound();
  }

  // Get page content for this specific program
  const pageContent = await getPageContent("programs");
  const programPage = (
    pageContent?.content as { programPages?: Record<string, ProgramPageContent> } | undefined
  )?.programPages?.[slug];

  return (
    <>
      <PageHeader title={`${program.name} · Page Content`} subtitle="Pages · Programs" />
      <main className="p-4 md:p-6">
        <ProgramPageEditor program={program} initialContent={programPage} />
      </main>
    </>
  );
}