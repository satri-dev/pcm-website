import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import BlogsServer from "./BlogsServer";
import { getBlogSettings } from "@/lib/data/blog-page-settings";
import { getCanonicalUrl } from "@/lib/seo-utils";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getBlogSettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    alternates: { canonical: getCanonicalUrl("/blogs") },
  };
}

export default async function BlogsPage() {
  return (
    <div className={poppins.variable}>
      <BlogsServer />
    </div>
  );
}
