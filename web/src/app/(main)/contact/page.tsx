import type { Metadata } from "next";
import ContactClient from "./ContactClient";

// Contact page content is static — address, hours and form UI never change
// at runtime. Cache Components prerenders the HTML shell automatically.
export const metadata: Metadata = {
  title: "Contact Us | Pokhara College of Management",
  description:
    "Contact Pokhara College of Management — address, phone, email and enquiry form. Reach our admissions team for questions about BBA, BBA-Finance and BCSIT programs.",
  keywords: [
    "PCM contact",
    "Pokhara College of Management contact",
    "PCM admissions",
    "PCM phone number",
    "PCM address Nadipur",
  ],
  openGraph: {
    title: "Contact Us | Pokhara College of Management",
    description:
      "Contact Pokhara College of Management — address, phone, email and enquiry form.",
    url: "https://www.pcm.edu.np/contact",
    images: [
      {
        url: "/assets/img/hero-3.jpg",
        width: 1200,
        height: 630,
        alt: "PCM campus Nadipur Pokhara",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Pokhara College of Management",
    description:
      "Contact Pokhara College of Management — address, phone, email and enquiry form.",
    images: ["/assets/img/hero-3.jpg"],
  },
  alternates: {
    canonical: "https://www.pcm.edu.np/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
