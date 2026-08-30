// src/types/faq-content.ts
// Dynamic content for the public /faq page (page hero, section head, CTA band).
// Stored in the site_settings collection under key "faq_page".

export interface FaqPageSettings {
  heroTitle: string;
  heroSubtitle: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export const FAQ_PAGE_SETTINGS_KEY = "faq_page";

export const FAQ_PAGE_SETTINGS_DEFAULTS: FaqPageSettings = {
  heroTitle: "Frequently Asked Questions",
  heroSubtitle:
    "Quick answers to the questions we hear most - about programmes, admissions, scholarships, campus life and more.",
  eyebrow: "Got questions?",
  title: "We have answers",
  subtitle:
    "Use the search or filter by topic to find what you need. Answers are maintained by the PCM admin team.",
  searchPlaceholder: "Search questions.",
  ctaEyebrow: "Enter to Learn - Go Forth to Serve",
  ctaTitle: "Ready to join PCM?",
  ctaText:
    "Applications for the 2083 intake are open. Take the first step towards your future today.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "Contact Us",
  ctaSecondaryHref: "/contact",
};
