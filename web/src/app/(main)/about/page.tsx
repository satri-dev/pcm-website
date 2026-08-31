import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import AboutClient from "./AboutClient";
import { getAboutData } from "@/lib/data/about";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageCopy("about");

  const title = [content?.hero?.title?.trim() || content?.label?.trim() || "About Us", "Pokhara College of Management"]
    .filter(Boolean)
    .join(" | ");
  const description =
    content?.hero?.subtitle?.trim() ||
    "Learn about Pokhara College of Management — our story, mission, values and what makes PCM different.";

  return {
    title,
    description,
    alternates: { canonical: "/about" },
    openGraph: {
      type: "website",
      siteName: "Pokhara College of Management",
      title,
      description,
      locale: "en_US",
      images: [{ url: "/assets/img/about-1.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/img/about-1.jpg"],
    },
  };
}

export default async function AboutPage() {
  const content = await getAboutData();
  return (
    <div className={poppins.variable}>
      <AboutClient content={content} />
    </div>
  );
}
