import type { Metadata } from "next";
import FeedbackClient from "./FeedbackClient";

export const metadata: Metadata = {
  title: "Feedback | Pokhara College of Management",
  description:
    "Submit feedback to PCM — share your suggestions, complaints or appreciation about academics, facilities, events and staff.",
  keywords: ["PCM feedback", "Pokhara College of Management feedback", "student feedback PCM"],
  openGraph: {
    title: "Feedback | Pokhara College of Management",
    description: "Share your suggestions, complaints or appreciation with the PCM team.",
    url: "https://www.pcm.edu.np/feedback",
    images: [{ url: "/assets/img/hero-3.jpg", width: 1200, height: 630, alt: "PCM Feedback" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Feedback | PCM", description: "Share your feedback with the PCM team.", images: ["/assets/img/hero-3.jpg"] },
  alternates: { canonical: "https://www.pcm.edu.np/feedback" },
};

export default function FeedbackPage() {
  return <FeedbackClient />;
}
