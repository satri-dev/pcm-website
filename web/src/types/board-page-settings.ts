// src/types/board-page-settings.ts
// Dynamic page chrome for the public /about/board page (hero, section head,
// our promise split, CTA band, SEO). The board of directors members live in
// the board collection and are fetched separately in order — they are NOT
// part of these settings.
// Stored in the site_settings collection under key "board_page".

export interface BoardPageSettings {
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;

  // Section head (governance)
  headEyebrow: string;
  headTitle: string;
  headSubtitle: string;

  // Our promise (split)
  promiseEyebrow: string;
  promiseTitle: string;
  promiseParagraphs: string[];
  promiseChecklist: string[];
  promiseImageSrc: string;
  promiseImageAlt: string;
  promiseBadgeValue: string;
  promiseBadgeLabel: string;

  // CTA Band
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export const BOARD_PAGE_SETTINGS_KEY = "board_page";

export const BOARD_PAGE_SETTINGS_DEFAULTS: BoardPageSettings = {
  seoTitle: "Board of Directors | Pokhara College of Management",
  seoDescription:
    "Meet the Board of Directors of Pokhara College of Management — the leadership guiding our vision, governance and growth since 2002.",
  seoKeywords: [
    "PCM board of directors",
    "Pokhara College of Management leadership",
    "PCM governance",
    "board members PCM",
  ],
  ogImage: "/assets/img/about-1.jpg",

  heroTitle: "Board of Directors",
  heroSubtitle:
    "The people steering PCM — guiding vision, governance and growth since 2002.",

  headEyebrow: "Governance",
  headTitle: "Our Board of Directors",
  headSubtitle:
    "A committed leadership team that keeps PCM rooted in quality, integrity and service.",

  promiseEyebrow: "Our promise",
  promiseTitle: "Governance rooted in student success",
  promiseParagraphs: [
    "Every decision at PCM flows from one question: how do we best serve our students? The board works closely with faculty, guardians and industry partners to keep our programs relevant, our campus supportive and our graduates ready for the world.",
  ],
  promiseChecklist: [
    "Regular curriculum reviews aligned with Pokhara University",
    "Transparent, merit-based scholarship and admission policies",
    "Investment in faculty, facilities and student experience",
  ],
  promiseImageSrc: "/assets/img/about-1.jpg",
  promiseImageAlt: "The PCM campus in Nadipur",
  promiseBadgeValue: "2002",
  promiseBadgeLabel: "Established",

  ctaTitle: "A step towards your future",
  ctaText:
    "Applications for the 2083 intake are open across all three programs. Take the first step today.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "Explore Programs",
  ctaSecondaryHref: "/programs",
};
