import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NoticesClient from "./NoticesClient";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Notices | Pokhara College of Management",
  description:
    "Official notices from PCM — admission announcements, entrance exam schedules, results, scholarships and events.",
  alternates: { canonical: "/notices" },
};

export default function NoticesPage() {
  return (
    <div className={poppins.variable}>
      <NoticesClient />
    </div>
  );
}
