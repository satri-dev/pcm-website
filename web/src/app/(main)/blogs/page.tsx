import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import BlogsClient from "./BlogsClient";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Blog & Articles | Pokhara College of Management",
  description:
    "Career guidance, industry trends and practical advice for students and parents — the official blog of Pokhara College of Management.",
  alternates: { canonical: "/blogs" },
};

export default function BlogsPage() {
  return (
    <div className={poppins.variable}>
      <BlogsClient />
    </div>
  );
}
