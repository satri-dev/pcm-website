// src/types/facilities-page-settings.ts
// Configurable page chrome for the public /about/facility page: SEO, hero,
// campus section head, split "designed for learning" section, and CTA band.
// The facility cards themselves come from the facilities collection
// (src/app/admin/campus/facilities) and are fetched separately — they are NOT
// part of these settings. Each facility's `description` is rich-text HTML and
// is rendered with prose styling on the public page.
// Stored in the site_settings collection under key "facility_page".

export interface FacilitiesPageSettings {
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;

  // Campus section head
  campusEyebrow: string;
  campusTitle: string;
  campusSubtitle: string;

  // Campus map button
  mapButtonLabel: string;
  mapButtonHref: string;

  // Designed for learning (split)
  designedEyebrow: string;
  designedTitle: string;
  designedParagraph: string;
  designedChecklist: string[];
  designedImage: string;
  designedImageAlt: string;
  designedBadgeValue: string;
  designedBadgeLabel: string;

  // CTA Band
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export const FACILITIES_PAGE_SETTINGS_KEY = "facility_page";

export const FACILITIES_PAGE_SETTINGS_DEFAULTS: FacilitiesPageSettings = {
  seoTitle: "Campus & Facilities | Pokhara College of Management",
  seoDescription:
    "Campus facilities at Pokhara College of Management — smart classrooms, IT labs, library, seminar hall, sports grounds, cafeteria and more at Nadipur, Pokhara.",
  seoKeywords: [
    "PCM facilities",
    "Pokhara College of Management campus",
    "PCM smart classrooms",
    "PCM library",
    "PCM IT labs",
    "PCM sports",
  ],
  ogImage: "/assets/img/about-1.jpg",

  heroTitle: "Campus & Facilities",
  heroSubtitle:
    "Everything a student needs to learn, create and grow — all on one campus at Nadipur.",

  campusEyebrow: "Our campus",
  campusTitle: "Facilities designed around you",
  campusSubtitle:
    "Modern classrooms, dedicated labs, a rich learning resource centre and space to play and unwind.",

  mapButtonLabel: "View campus map",
  mapButtonHref: "/about/campus-map",

  designedEyebrow: "Designed for learning",
  designedTitle: "A campus that feels like home",
  designedParagraph:
    "From quiet study corners in the learning resource centre to buzzing group-work zones, the PCM campus supports every kind of learner. High-speed internet, comfortable classrooms and welcoming open spaces make long study days easy.",
  designedChecklist: [
    "Smart classrooms with modern projectors and AV",
    "Dedicated IT labs for BCSIT practicals",
    "24/7 high-speed campus Wi-Fi",
    "Safe, shaded outdoor spaces for breaks and sports",
  ],
  designedImage: "/assets/img/about-1.jpg",
  designedImageAlt: "PCM learning resource centre",
  designedBadgeValue: "2",
  designedBadgeLabel: "Buildings",

  ctaTitle: "See the campus for yourself",
  ctaText:
    "Visit us at Nadipur for a guided tour, or apply today and start your journey at PCM.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "Book a Visit",
  ctaSecondaryHref: "/contact",
};
