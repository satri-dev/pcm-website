import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import AboutServer from "./AboutServer";
import { getAboutSettings } from "@/lib/data/about-page-settings";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAboutSettings();
  const canonical = "https://www.pcm.edu.np/about";
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: "Pokhara College of Management",
      title: settings.seoTitle,
      description: settings.seoDescription,
      locale: "en_US",
      images: [{ url: settings.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description: settings.seoDescription,
      images: [settings.ogImage],
    },
  };
}

export default async function AboutPage() {
  return (
    <div className={poppins.variable}>
      <AboutServer />
    </div>
  );
}
