import type { Metadata } from "next";
import HeroSlider from "@/components/home/HeroSlider";
import WelcomeSection from "@/components/home/WelcomeSection";
import WhyChoosePCM from "@/components/home/WhyChoosePCM";
import ProgramsSection from "@/components/home/ProgramsSection";
import AdmissionSection from "@/components/home/AdmissionSection";
import FacilitiesSection from "@/components/home/FacilitiesSection";
import NewsSection from "@/components/home/NewsSection";
import EventsSection from "@/components/home/EventsSection";
import GallerySection from "@/components/home/GallerySection";
import BlogsSection from "@/components/home/BlogsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import { BreadcrumbSchema, EducationalOrganizationSchema } from "../structured-data";

export const metadata: Metadata = {
  title: "Pokhara College of Management | BBA, BCSIT in Pokhara",
  description: "Pokhara College of Management — affordable, quality management and IT education in Pokhara. BBA, BBA-Finance and BCSIT degrees affiliated to Pokhara University.",
  keywords: [
    "Pokhara College of Management",
    "PCM",
    "BBA in Pokhara",
    "BCSIT in Pokhara",
    "BBA Finance",
    "Management College Pokhara",
    "IT College Pokhara",
    "Pokhara University",
    "Business Administration Pokhara",
    "Computer Science Pokhara"
  ],
  authors: [{ name: "Pokhara College of Management" }],
  creator: "Pokhara College of Management",
  publisher: "Pokhara College of Management",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://www.pcm.edu.np/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.pcm.edu.np/",
    title: "Pokhara College of Management | BBA, BBA-Finance & BCSIT in Pokhara",
    description: "Pokhara College of Management — affordable, quality management and IT education in Pokhara. BBA, BBA-Finance and BCSIT degrees affiliated to Pokhara University.",
    siteName: "Pokhara College of Management",
    images: [
      {
        url: "https://www.pcm.edu.np/images/hero-1.jpg",
        width: 1200,
        height: 630,
        alt: "Pokhara College of Management Campus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokhara College of Management | BBA, BBA-Finance & BCSIT in Pokhara",
    description: "Pokhara College of Management — affordable, quality management and IT education in Pokhara. BBA, BBA-Finance and BCSIT degrees affiliated to Pokhara University.",
    images: ["https://www.pcm.edu.np/images/hero-1.jpg"],
  },
  verification: {
    google: "your-google-verification-code", // Add actual verification code
  },
  other: {
    "theme-color": "#21409A",
  },
};

export default function HomePage() {
  return (
    <>
      <BreadcrumbSchema />
      <EducationalOrganizationSchema />
      <HeroSlider />
      <WelcomeSection />
      <WhyChoosePCM />
      <ProgramsSection />
      <AdmissionSection />
      <FacilitiesSection />
      <NewsSection />
      <EventsSection />
      <GallerySection />
      <BlogsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
