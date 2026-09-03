// src/types/clubs-page-settings.ts
// Configurable page chrome for the public /clubs page: SEO, hero, "why join"
// split section, clubs-list section head, and CTA band. The club cards
// themselves come from the clubs collection (src/app/admin/people/clubs) and
// are fetched separately — they are NOT part of these settings.
// Stored in the site_settings collection under key "clubs_page".

export interface ClubsPageSettings {
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;

  // Why join (split)
  whyEyebrow: string;
  whyTitle: string;
  whyParagraph: string;
  whyChecklist: string[];
  whyImage: string;
  whyImageAlt: string;
  whyBadgeValue: string;
  whyBadgeLabel: string;

  // Clubs-list section head
  clubsEyebrow: string;
  clubsTitle: string;
  clubsSubtitle: string;

  // CTA Band
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export const CLUBS_PAGE_SETTINGS_KEY = "clubs_page";

export const CLUBS_PAGE_SETTINGS_DEFAULTS: ClubsPageSettings = {
  seoTitle: "Student Clubs | Pokhara College of Management",
  seoDescription:
    "Six active student clubs at PCM — eco, finance, coding, debate, music and sports — where students lead, create and belong.",
  seoKeywords: [
    "PCM student clubs",
    "Pokhara College of Management clubs",
    "PCM eco club",
    "PCM coding club",
    "PCM debate club",
    "PCM music club",
    "PCM sports club",
  ],
  ogImage: "/assets/img/about-1.jpg",

  heroTitle: "Student Clubs",
  heroSubtitle:
    "Six active student clubs at PCM — eco, finance, coding, debate, music and sports — where students lead, create and build skills beyond the classroom.",

  whyEyebrow: "Why join?",
  whyTitle: "Leadership happens outside the lecture hall",
  whyParagraph:
    "Employers look for more than grades. Club leadership, event management and teamwork give PCM students the confidence and experience that make their résumés stand out.",
  whyChecklist: [
    "Run real events — fests, seminars and competitions",
    "Build a portfolio of leadership and teamwork",
    "Connect with mentors, alumni and industry partners",
  ],
  whyImage: "/assets/img/about-games.jpg",
  whyImageAlt: "PCM club activities and sports",
  whyBadgeValue: "6+",
  whyBadgeLabel: "Active Clubs",

  clubsEyebrow: "Clubs, one community",
  clubsTitle: "Find your crew",
  clubsSubtitle:
    "Every club is run by students, for students — with a faculty mentor and a calendar of events each semester.",

  ctaTitle: "A step towards your future",
  ctaText:
    "Applications for the 2083 intake are open across all three programs. Take the first step today.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "Explore Programs",
  ctaSecondaryHref: "/programs",
};
