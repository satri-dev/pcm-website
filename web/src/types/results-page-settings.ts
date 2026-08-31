// src/types/results-page-settings.ts
// Dynamic page chrome for the public /results page.
// Stored in site_settings under key "results_page".

export interface ResultsPageSettings {
  heroTitle: string;
  heroSubtitle: string;

  sectionEyebrow: string;
  sectionTitle: string;

  portalTitle: string;
  portalText: string;
  portalUrl: string;

  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;

  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

export const RESULTS_PAGE_SETTINGS_KEY = "results_page";

export const RESULTS_PAGE_SETTINGS_DEFAULTS: ResultsPageSettings = {
  heroTitle: "Results",
  heroSubtitle:
    "Semester results and marksheets for PCM students - published and verified by Pokhara University.",

  sectionEyebrow: "Examinations",
  sectionTitle: "Latest results",

  portalTitle: "Official results portal",
  portalText:
    "Semester results and marksheets are published by Pokhara University. Students can verify their grades on the official portal.",
  portalUrl: "https://results.pu.edu.np/",

  ctaEyebrow: "Enter to Learn \u2014 Go Forth to Serve",
  ctaTitle: "A step towards your future",
  ctaText:
    "Applications for the 2083 intake are open across all three programs. Take the first step today.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "Explore Programs",
  ctaSecondaryHref: "/programs",

  seoTitle: "Results | Pokhara College of Management",
  seoDescription:
    "Semester results and marksheets for PCM students - published and verified by Pokhara University.",
  seoKeywords: [
    "PCM results",
    "Pokhara College of Management results",
    "BBA results Nepal",
    "BCSIT results",
    "semester results PCM",
  ],
};
