// src/types/downloads-page-settings.ts
// Dynamic content for the public /downloads page (page hero, section head, CTA band).
// Stored in the site_settings collection under key "downloads_page".

export interface DownloadsPageSettings {
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

export const DOWNLOADS_PAGE_SETTINGS_KEY = "downloads_page";

export const DOWNLOADS_PAGE_SETTINGS_DEFAULTS: DownloadsPageSettings = {
  heroTitle: "Downloads",
  heroSubtitle:
    "Access prospectuses, admission forms, syllabi and scholarship application forms — all in one place.",
  eyebrow: "Resources",
  title: "Official documents & forms",
  subtitle:
    "Download the files you need. All documents are current for the 2083 intake.",
  searchPlaceholder: "Search documents…",
  ctaEyebrow: "Enter to Learn — Go Forth to Serve",
  ctaTitle: "Ready to apply?",
  ctaText:
    "Download your admission form above and submit it to the PCM office before Ashar 26, 2083.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "Contact Us",
  ctaSecondaryHref: "/contact",
};
