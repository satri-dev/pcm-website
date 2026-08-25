import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import BlogsStudentClient from "./BlogsStudentClient";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Student Blogs | Pokhara College of Management",
  description:
    "First-person stories from PCM students — internships, festivals, clubs and growth at Pokhara College of Management.",
  alternates: { canonical: "/blogs-student" },
};

export default function BlogsStudentPage() {
  return (
    <div className={poppins.variable}>
      <BlogsStudentClient />
    </div>
  );
}
