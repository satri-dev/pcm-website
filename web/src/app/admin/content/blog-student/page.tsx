import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import BlogStudentManager from "./_components/blog-student-manager";
import { listBlogStudents } from "@/repositories/blog-student.repository";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Student Blog Management",
  description:
    "Review and approve public student blog submissions for Pokhara College of Management before they appear on the website.",
  robots: { index: false, follow: false },
};

export default async function BlogStudentPage() {
  await connection();
  const { items } = await listBlogStudents({ pageSize: 100 });

  return (
    <>
      <PageHeader title="Student Blog" subtitle="Content · Student Blog" />
      <BlogStudentManager initialData={items} />
    </>
  );
}