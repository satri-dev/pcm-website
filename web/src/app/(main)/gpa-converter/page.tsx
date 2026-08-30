import type { Metadata } from "next";
import GpaClient from "./GpaClient";

// All content is static — grading scale and UI never change at runtime.
export const metadata: Metadata = {
  title: "GPA Calculator | Pokhara University Grading Scale | PCM Pokhara",
  description:
    "Calculate your SGPA instantly using the Pokhara University grading scale. Enter subject marks, credit hours and practical marks — PCM's free GPA calculator for BBA, BBA-Finance and BCSIT students.",
  keywords: [
    "GPA calculator Nepal",
    "Pokhara University GPA",
    "SGPA calculator PCM",
    "BBA GPA calculator",
    "BCSIT GPA Pokhara",
    "PU grading scale",
    "PCM Pokhara GPA",
  ],
  openGraph: {
    title: "GPA Calculator | Pokhara University Grading Scale | PCM",
    description:
      "Calculate your SGPA using the Pokhara University grading scale. Free tool for BBA, BBA-Finance and BCSIT students at PCM.",
    url: "https://www.pcm.edu.np/gpa-converter",
    images: [{ url: "/assets/img/hero-1.jpg", width: 1200, height: 630, alt: "PCM GPA Calculator" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GPA Calculator | PCM Pokhara",
    description: "Calculate your SGPA using the Pokhara University grading scale.",
    images: ["/assets/img/hero-1.jpg"],
  },
  alternates: {
    canonical: "https://www.pcm.edu.np/gpa-converter",
  },
};

export default function GpaConverterPage() {
  return <GpaClient />;
}
