import type { Metadata } from "next";
import TestimonialsClient from "./TestimonialsClient";

export const metadata: Metadata = {
  title: "Student Testimonials | Pokhara College of Management",
  description:
    "What students, graduates and parents say about Pokhara College of Management — real stories from the PCM community.",
  alternates: { canonical: "/testimonials" },
  openGraph: {
    type: "website",
    siteName: "Pokhara College of Management",
    title: "Student Testimonials | Pokhara College of Management",
    description:
      "What students, graduates and parents say about Pokhara College of Management — real stories from the PCM community.",
    locale: "en_US",
    images: [{ url: "/images/hero-4.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Testimonials | Pokhara College of Management",
    description:
      "What students, graduates and parents say about Pokhara College of Management — real stories from the PCM community.",
    images: ["/images/hero-4.jpg"],
  },
};

export default function TestimonialsPage() {
  return <TestimonialsClient />;
}
