import type { Metadata } from "next";
import { getPrivacyPageSettings } from "@/lib/data/legal-pages";
import LegalPageRenderer from "@/components/legal/LegalPageRenderer";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPrivacyPageSettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: ["privacy", "policy", "pokhara college of management", "pcm", "data protection"],
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      type: "website",
    },
  };
}

export default async function PrivacyPage() {
  const settings = await getPrivacyPageSettings();
  return <LegalPageRenderer page={settings} />;
}
