// src/types/notices-page-settings.ts
// Dynamic page chrome for the public /notices page.
// Stored in site_settings under key "notices_page".

export interface NoticesPageSettings {
  heroTitle: string;
  heroSubtitle: string;

  sectionEyebrow: string;
  sectionTitle: string;

  subscribeTitle: string;
  subscribeText: string;

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

export const NOTICES_PAGE_SETTINGS_KEY = "notices_page";

export const NOTICES_PAGE_SETTINGS_DEFAULTS: NoticesPageSettings = {
  heroTitle: "Notices",
  heroSubtitle:
    "Official announcements from the administration \u2014 admissions, exams, results and events.",

  sectionEyebrow: "Announcements",
  sectionTitle: "Latest notices",

  subscribeTitle: "Get notices by email",
  subscribeText:
    "Subscribe to receive admission and exam updates directly.",

  ctaEyebrow: "Enter to Learn \u2014 Go Forth to Serve",
  ctaTitle: "A step towards your future",
  ctaText:
    "Applications for the 2083 intake are open across all three programs. Take the first step today.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "Explore Programs",
  ctaSecondaryHref: "/programs",

  seoTitle: "Notices | Pokhara College of Management",
  seoDescription:
    "Official notices from PCM \u2014 admission announcements, entrance exam schedules, results, scholarships and events.",
  seoKeywords: [
    "PCM notices",
    "Pokhara College of Management notices",
    "PCM admission notice",
    "BBA notices Nepal",
    "PCM exam schedule",
  ],
};
