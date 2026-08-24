import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import AboutClient from "./AboutClient";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "About Us | Pokhara College of Management",
  description:
    "Learn about Pokhara Collegesc  what makes PCM different.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    siteName: "Pokhara College of Management",
    title: "About Us | Pokhara College of Management",
    description:
      "Learn about Pokhara College of Management — our story, mission, values and what makes PCM different.",
    locale: "en_US",
    images: [{ url: "/assets/img/about-1.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Pokhara College of Management",
    description:
      "Learn about Pokhara College of Management — our story, mission, values and what makes PCM different.",
    images: ["/assets/img/about-1.jpg"],
  },
};

export default function AboutPage() {
  return (
    <div className={poppins.variable}>
      <AboutClient />
    </div>
  );
}
