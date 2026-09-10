// src/types/news-page-settings.ts
// Dynamic page chrome for the public /news page.
// Stored in site_settings under key "news_page".

export interface NewsPageSettings {
  heroTitle: string;
  heroSubtitle: string;

  featuredEyebrow: string;
  featuredTitle: string;

  storiesEyebrow: string;
  storiesTitle: string;

  sidebarNoticesTitle: string;

  newsletterTitle: string;
  newsletterText: string;

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

export const NEWS_PAGE_SETTINGS_KEY = "news_page";

export const NEWS_PAGE_SETTINGS_DEFAULTS: NewsPageSettings = {
  heroTitle: "News & Notices",
  heroSubtitle:
    "Achievements, events and official announcements from across the PCM campus.",

  featuredEyebrow: "Featured",
  featuredTitle: "Featured story",

  storiesEyebrow: "Newsroom",
  storiesTitle: "More stories",

  sidebarNoticesTitle: "Official Notices",

  newsletterTitle: "Stay updated",
  newsletterText:
    "Follow PCM on social media or subscribe to receive notices in your inbox.",

  ctaEyebrow: "Enter to Learn — Go Forth to Serve",
  ctaTitle: "A step towards your future",
  ctaText:
    "Applications for the 2083 intake are open across all three programs. Take the first step today.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "More Info",
  ctaSecondaryHref: "/about",

  seoTitle: "News & Notices | Pokhara College of Management",
  seoDescription:
    "Achievements, events and official announcements from across the PCM campus in Pokhara.",
  seoKeywords: [
    "PCM news",
    "Pokhara College of Management announcements",
    "PCM campus news",
    "BBA news Nepal",
    "PCM events",
  ],
};
