// src/types/placements-page-settings.ts
// Dynamic content for the public /placements page.
// Stored in the site_settings collection under key "placements_page".

export interface PlacementPartnerData {
  id: string;
  sector: string;
  iconType: "bank" | "tech" | "corporate";
  iconBg: string;
  iconColor: string;
  companies: string;
  description: string;
}

export interface PlacementServiceData {
  id: string;
  text: string;
}

export interface PlacementStatData {
  id: string;
  value: string;
  label: string;
}

export interface PlacementsPageSettings {
  // Hero
  heroTitle: string;
  heroSubtitle: string;

  // Classroom to Career
  classEyebrow: string;
  classTitle: string;
  classParagraphs: string[];
  classPills: string[];
  classImageSrc: string;
  classImageAlt: string;
  badgeValue: string;
  badgeLabel: string;

  // Industry Connect / Partners
  partnersEyebrow: string;
  partnersTitle: string;
  partnersSubtitle: string;
  partners: PlacementPartnerData[];

  // Career Guidance
  guidanceEyebrow: string;
  guidanceTitle: string;
  guidanceParagraph: string;
  guidanceImageSrc: string;
  guidanceImageAlt: string;
  services: PlacementServiceData[];

  // Stats Bar
  stats: PlacementStatData[];

  // CTA Band
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;

  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string;
}

export const PLACEMENTS_PAGE_SETTINGS_KEY = "placements_page";

export const PLACEMENTS_PAGE_SETTINGS_DEFAULTS: PlacementsPageSettings = {
  heroTitle: "Placements & Careers",
  heroSubtitle:
    "PCM prepares graduates not just for exams but for careers — with strong recruiter partnerships, career guidance and a 90% placement rate across BBA, BBA-Finance and BCSIT programmes.",

  classEyebrow: "Career outcomes",
  classTitle: "From classroom to career",
  classParagraphs: [
    "Our academic programmes are designed in close consultation with industry partners, ensuring graduates are equipped with practical skills and professional readiness from day one.",
    "Through campus recruitment drives, internship placements and career mentorship, PCM graduates consistently secure roles at Nepal's leading organisations shortly after completing their studies.",
  ],
  classPills: ["90% Placement Rate", "Campus Drives", "Internships", "Career Guidance"],
  classImageSrc: "/assets/img/about-graduation.jpg",
  classImageAlt: "PCM graduation ceremony",
  badgeValue: "90%",
  badgeLabel: "Placement Rate",

  partnersEyebrow: "Industry connect",
  partnersTitle: "Recruitment partners",
  partnersSubtitle:
    "Our graduates are recruited by leading organisations across three major sectors in Nepal.",
  partners: [
    {
      id: "banking",
      sector: "Banking & Finance",
      iconType: "bank",
      iconBg: "#eaf9ee",
      iconColor: "#3F9E35",
      companies:
        "Nabil Bank, NIC Asia, Mega, Global IME, Himalayan and other leading banks",
      description:
        "Nepal's leading banks and financial institutions actively recruit BBA and BBA-Finance graduates for management trainee and analyst roles.",
    },
    {
      id: "tech",
      sector: "Technology & IT",
      iconType: "tech",
      iconBg: "#eef3ff",
      iconColor: "#21409A",
      companies:
        "F1Soft, Leapfrog, CloudFactory and growing ecosystem of software companies",
      description:
        "Top Nepali tech companies recruit BCSIT graduates for software development, data analysis and IT consulting roles.",
    },
    {
      id: "corporate",
      sector: "Corporate & Startups",
      iconType: "corporate",
      iconBg: "#fff7e8",
      iconColor: "#b98a12",
      companies:
        "Marketing, HR, operations and management roles across Nepali companies",
      description:
        "Marketing, HR, operations and management roles across Nepali companies, NGOs and new ventures.",
    },
  ],

  guidanceEyebrow: "Student support",
  guidanceTitle: "Career guidance at every step",
  guidanceParagraph:
    "Our dedicated placement cell works year-round to prepare students for the job market — from the first semester to final placement.",
  guidanceImageSrc: "/assets/img/about-2.jpg",
  guidanceImageAlt: "Career guidance session at PCM",
  services: [
    { id: "cv", text: "CV and cover-letter workshops" },
    { id: "mock", text: "Mock interviews and group-discussion practice" },
    { id: "internship", text: "Internship placement with partner organizations" },
    { id: "campus", text: "Campus recruitment drives and job referrals" },
    { id: "mentorship", text: "Mentorship from alumni working across industries" },
  ],

  stats: [
    { id: "rate", value: "90%", label: "Placement Rate" },
    { id: "partners", value: "50+", label: "Hiring Partners" },
    { id: "batches", value: "20+", label: "Years of Placements" },
    { id: "sectors", value: "3", label: "Key Sectors" },
  ],

  ctaEyebrow: "Enter to Learn — Go Forth to Serve",
  ctaTitle: "Your career starts at PCM",
  ctaText:
    "Join thousands of PCM alumni thriving across Nepal's banks, tech companies and enterprises. Applications for 2083 are open.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "Explore Programs",
  ctaSecondaryHref: "/programs",

  seoTitle: "Placements & Careers | Pokhara College of Management",
  seoDescription:
    "Career & placement support at PCM — recruitment partners, internship opportunities, career guidance and 90% placement rate for BBA, BBA-Finance and BCSIT graduates.",
  seoKeywords: [
    "PCM placements",
    "Pokhara College of Management careers",
    "BBA placement Nepal",
    "BCSIT jobs Nepal",
    "PCM internship",
    "campus recruitment Pokhara",
  ],
  ogImage: "/assets/img/about-graduation.jpg",
};
