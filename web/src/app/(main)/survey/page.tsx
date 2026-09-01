import type { Metadata } from "next";
import SurveyClient from "./SurveyClient";

export const metadata: Metadata = {
  title: "Surveys & Polls | Pokhara College of Management",
  description:
    "Participate in ongoing surveys and polls at PCM — share your experience to help us improve teaching, facilities and student life.",
  keywords: ["PCM surveys", "Pokhara College of Management poll", "student survey PCM"],
  openGraph: {
    title: "Surveys & Polls | Pokhara College of Management",
    description: "Participate in PCM surveys and help us improve the college experience.",
    url: "https://www.pcm.edu.np/survey",
    images: [{ url: "/assets/img/hero-3.jpg", width: 1200, height: 630, alt: "PCM Surveys" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Surveys | PCM", description: "Take part in PCM surveys.", images: ["/assets/img/hero-3.jpg"] },
  alternates: { canonical: "https://www.pcm.edu.np/survey" },
};

export default function SurveyPage() {
  return <SurveyClient />;
}
