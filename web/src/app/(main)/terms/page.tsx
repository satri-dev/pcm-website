import type { Metadata } from "next";
import { getTermsPageSettings } from "@/lib/data/legal-pages";
import LegalPageRenderer from "@/components/legal/LegalPageRenderer";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getTermsPageSettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: ["terms", "services", "pokhara college of management", "pcm", "website terms"],
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      type: "website",
    },
  };
}

export default async function TermsPage() {
  const settings = await getTermsPageSettings();
  return <LegalPageRenderer page={settings} />;
}
