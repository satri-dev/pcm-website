// src/types/faculty-page-settings.ts
// Dynamic page chrome for the public /about/faculty page (hero, leadership
// section head, faculty & administration section head, by the numbers, CTA
// band, SEO). The faculty/staff cards live in the faculty collection and are
// fetched separately, grouped by their configured group — they are NOT part
// of these settings.
// Stored in the site_settings collection under key "faculty_page".

export interface FacultyStat {
  id: string;
  count: number;
  suffix: string;
  label: string;
}

export interface FacultyPageSettings {
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;

  // Leadership section
  leadershipEyebrow: string;
  leadershipTitle: string;

  // Faculty & administration section
  teamEyebrow: string;
  teamTitle: string;

  // By the numbers
  statsEyebrow: string;
  statsTitle: string;
  stats: FacultyStat[];

  // CTA Band
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export const FACULTY_PAGE_SETTINGS_KEY = "faculty_page";

export const FACULTY_PAGE_SETTINGS_DEFAULTS: FacultyPageSettings = {
  seoTitle: "Staff & Faculty | Pokhara College of Management",
  seoDescription:
    "Meet the faculty and staff of Pokhara College of Management — qualified, experienced and genuinely invested in your success.",
  seoKeywords: [
    "PCM faculty",
    "Pokhara College of Management staff",
    "PCM teachers",
    "staff and faculty PCM",
    "BBA faculty Pokhara",
    "BCSIT faculty",
  ],
  ogImage: "/assets/img/about-1.jpg",

  heroTitle: "Staff & Faculty",
  heroSubtitle:
    "The dedicated people behind PCM — qualified, experienced and genuinely invested in your success.",

  leadershipEyebrow: "Leadership",
  leadershipTitle: "Guiding PCM",

  teamEyebrow: "Our team",
  teamTitle: "Faculty & administration",

  statsEyebrow: "By the numbers",
  statsTitle: "A legacy measured in outcomes",
  stats: [
    { id: "s1", count: 80, suffix: "%", label: "Success stories" },
    { id: "s2", count: 100, suffix: "", label: "Dean's List Scholars" },
    { id: "s3", count: 1000, suffix: "", label: "Graduates" },
    { id: "s4", count: 23, suffix: "", label: "Years of Excellence" },
  ],

  ctaTitle: "Join a college that cares",
  ctaText:
    "Experience the PCM difference for yourself — apply for the 2083 intake today.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "More Info",
  ctaSecondaryHref: "/about",
};
