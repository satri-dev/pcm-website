// src/types/gallery-settings.ts
// Dynamic content for the public /gallery page (page hero, section head, CTA band).
// Stored in the site_settings collection under key "gallery_page".

export interface GalleryPageSettings {
  heroTitle: string;
  heroSubtitle: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export const GALLERY_PAGE_SETTINGS_KEY = "gallery_page";

export const GALLERY_PAGE_SETTINGS_DEFAULTS: GalleryPageSettings = {
  heroTitle: "Campus Gallery",
  heroSubtitle:
    "Glimpses of PCM — take a visual tour through campus life, events, student achievements and academic activities.",
  eyebrow: "Glimpses of PCM",
  title: "Explore our albums",
  subtitle:
    "Browse by category, open any album, then click a photo to view it full-size.",
  ctaEyebrow: "Enter to Learn — Go Forth to Serve",
  ctaTitle: "Want to see it in person?",
  ctaText: "Book a campus visit and experience the PCM community for yourself.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "More Info",
  ctaSecondaryHref: "/about",
};
