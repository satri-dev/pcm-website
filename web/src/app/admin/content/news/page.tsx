import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import NewsManager from "./_components/news-manager";

export const metadata: Metadata = {
  title: "News Management",
  description:
    "Create, edit, and manage news articles for Pokhara College of Management website. Control published content, featured stories, and article categorization.",
  robots: { index: false, follow: false },
};

export default function NewsPage() {
  return (
    <>
      <PageHeader title="News articles" subtitle="Content · News" />
      <NewsManager />
    </>
  );
}
