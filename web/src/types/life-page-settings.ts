// src/types/life-page-settings.ts
// Configurable page chrome for the public /life page: SEO, hero, the three
// feature-card sections (Events & Tours, Workshops & Seminars, Student Clubs),
// the gallery strip, and the CTA band. The gallery photos themselves come from
// the gallery collection (src/app/admin/media/gallery) and are fetched
// separately — they are NOT part of these settings.
// Stored in the site_settings collection under key "life_page".

export interface LifeFeatureCard {
  title: string;
  desc: string;
}

export interface LifePageSettings {
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;

  // Events & Tours
  eventsEyebrow: string;
  eventsTitle: string;
  eventsSubtitle: string;
  eventCards: LifeFeatureCard[];

  // Workshops & Seminars
  workshopsEyebrow: string;
  workshopsTitle: string;
  workshopsSubtitle: string;
  workshopCards: LifeFeatureCard[];

  // Student Clubs
  clubsEyebrow: string;
  clubsTitle: string;
  clubsSubtitle: string;
  clubCards: LifeFeatureCard[];

  // Gallery strip
  galleryEyebrow: string;
  galleryTitle: string;
  gallerySubtitle: string;
  galleryButtonLabel: string;
  galleryButtonHref: string;

  // CTA Band
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export const LIFE_PAGE_SETTINGS_KEY = "life_page";

export const LIFE_PAGE_SETTINGS_DEFAULTS: LifePageSettings = {
  seoTitle: "Life at PCM | Campus Life, Events & Clubs",
  seoDescription:
    "A typical day on campus, facilities, events, tours, workshops, seminars and the close-knit student community at Pokhara College of Management.",
  seoKeywords: [
    "Life at PCM",
    "Pokhara College of Management campus life",
    "PCM events",
    "PCM workshops",
    "PCM student clubs",
    "PCM tours",
  ],
  ogImage: "/assets/img/hero-5.jpg",

  heroTitle: "Life at PCM",
  heroSubtitle:
    "A degree is only part of the story. Here\u2019s what four years at PCM really feels like.",

  eventsEyebrow: "Events & Tours",
  eventsTitle: "Beyond the classroom",
  eventsSubtitle:
    "From flagship fests to educational tours, campus life at PCM is full, varied and genuinely fun.",
  eventCards: [
    { title: "Annual Fest", desc: "The highlight of the year — performances, contests, food and the whole college together in one place." },
    { title: "Educational tours", desc: "Field trips across Pokhara and beyond that turn theory into first-hand experience." },
    { title: "Industry visits", desc: "Behind-the-scenes access to banks, tech companies and enterprises that hire our graduates." },
    { title: "Cultural programs", desc: "Celebrating Nepal\u2019s diversity through dance, music, dress and shared traditions." },
  ],

  workshopsEyebrow: "Workshops & Seminars",
  workshopsTitle: "Skills that set you apart",
  workshopsSubtitle:
    "Regular workshops and seminars keep your learning current and connected to industry.",
  workshopCards: [
    { title: "Data analytics workshop", desc: "Hands-on sessions with the tools shaping modern decision-making." },
    { title: "Communication & public speaking", desc: "Model press conferences and presentation clinics that build real confidence." },
    { title: "Tech & coding bootcamps", desc: "Practical, project-based skill-building beyond the core BCSIT syllabus." },
    { title: "Financial literacy seminars", desc: "Guest experts on markets, investing and personal finance." },
  ],

  clubsEyebrow: "Student Clubs",
  clubsTitle: "Find your people",
  clubsSubtitle:
    "PCM has always encouraged student clubs to lead, organise and create.",
  clubCards: [
    { title: "Innovation & Idea Club", desc: "Where startup ideas are pitched, challenged and refined." },
    { title: "Social Service Club", desc: "Blood drives, clean-ups and community initiatives." },
    { title: "Sports Club", desc: "Football, futsal, cricket and the annual athletics meet." },
    { title: "Literature & Arts Club", desc: "Writing, debate, music and creative expression." },
  ],

  galleryEyebrow: "The campus in pictures",
  galleryTitle: "Life as it happens",
  gallerySubtitle: "A snapshot of the moments, events and people that make PCM what it is.",
  galleryButtonLabel: "See the full gallery",
  galleryButtonHref: "/gallery",

  ctaTitle: "Come and be part of it",
  ctaText:
    "Applications for BBA, BBA-Finance and BCSIT are open now.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "More Info",
  ctaSecondaryHref: "/about",
};
