import type { Metadata } from "next";

import PageHeader from "../_components/dashboard/page-header";
import BlogManager from "./_components/blog-manager";

export const metadata: Metadata = {
  title: "Blog Management",
  description:
    "Create, edit, and manage blog posts for Pokhara College of Management website. Control content, authorship, categories, and publication status.",
  robots: { index: false, follow: false },
};

export default async function BlogPage() {
  return (
    <>
      <PageHeader title="Blogs" subtitle="Content · Blog" />
      <BlogManager />
    </>
  );
}
