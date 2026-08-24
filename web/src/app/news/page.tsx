import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NewsClient from "./NewsClient";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "News & Notices | Pokhara College of Management",
  description:
    "Achievements, events and official announcements from across the PCM campus in Pokhara.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  return (
    <div className={poppins.variable}>
      <NewsClient />
    </div>
  );
}
