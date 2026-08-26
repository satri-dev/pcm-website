import type { Metadata } from "next";
import AlumniClient from "./AlumniClient";

export const metadata: Metadata = {
  title: "Alumni Network | Pokhara College of Management",
  description:
    "Meet the graduates of Pokhara College of Management — 1000+ professionals in banking, technology, entrepreneurship and beyond.",
  alternates: { canonical: "/alumni" },
  openGraph: {
    type: "website",
    siteName: "Pokhara College of Management",
    title: "Alumni Network | Pokhara College of Management",
    description:
      "Meet the graduates of Pokhara College of Management — 1000+ professionals in banking, technology, entrepreneurship and beyond.",
    locale: "en_US",
    images: [{ url: "/images/about-graduation.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alumni Network | Pokhara College of Management",
    description:
      "Meet the graduates of Pokhara College of Management — 1000+ professionals in banking, technology, entrepreneurship and beyond.",
    images: ["/images/about-graduation.jpg"],
  },
};

export default function AlumniPage() {
  return <AlumniClient />;
}
