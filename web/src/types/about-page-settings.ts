// src/types/about-page-settings.ts
// Dynamic page chrome for the public /about page (hero, who-we-are, why-PCM,
// vision/mission/values, difference, stats, testimonials headings, CTA band,
// SEO). Testimonials themselves live in the homepage collection and are
// fetched separately — they are NOT part of these settings.
// Stored in the site_settings collection under key "about_page".

export type VmvIconType = "vision" | "mission" | "values";

export interface VmvCard {
  id: string;
  iconType: VmvIconType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

export type DiffIconType =
  | "faculty"
  | "lectures"
  | "it-courses"
  | "extracurriculars"
  | "industry"
  | "student-care";

export interface DiffItem {
  id: string;
  iconType: DiffIconType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface AboutStat {
  id: string;
  value: string;
  label: string;
}

export interface AboutPageSettings {
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;

  // Who we are (split)
  whoEyebrow: string;
  whoTitle: string;
  whoParagraphs: string[];
  whoPills: string[];
  whoImageSrc: string;
  whoImageAlt: string;
  whoBadgeValue: string;
  whoBadgeLabel: string;

  // Why study at PCM (reverse split)
  whyEyebrow: string;
  whyTitle: string;
  whyParagraphs: string[];
  whyImageSrc: string;
  whyImageAlt: string;
  whyCtaLabel: string;
  whyCtaHref: string;

  // Vision, Mission & Values (3 cards)
  vmvEyebrow: string;
  vmvTitle: string;
  vmvCards: VmvCard[];

  // The difference (icon-list)
  diffEyebrow: string;
  diffTitle: string;
  diffItems: DiffItem[];

  // By the numbers (stats)
  statsEyebrow: string;
  statsTitle: string;
  stats: AboutStat[];

  // Voices (headings — testimonials come from homepage collection)
  voicesEyebrow: string;
  voicesTitle: string;
  voicesSubtitle: string;
  voicesPerPage: number;

  // CTA Band
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export const ABOUT_PAGE_SETTINGS_KEY = "about_page";

export const ABOUT_PAGE_SETTINGS_DEFAULTS: AboutPageSettings = {
  seoTitle: "About Us | Pokhara College of Management",
  seoDescription:
    "Learn about Pokhara College of Management — our story, mission, values and what makes PCM different.",
  seoKeywords: [
    "about PCM",
    "Pokhara College of Management",
    "PCM history",
    "management college Nepal",
    "BBA Pokhara",
  ],
  ogImage: "/assets/img/about-1.jpg",

  heroTitle: "About Pokhara College of Management",
  heroSubtitle:
    "Since 2002, a home for confident, creative and adaptive graduates in the heart of Pokhara.",

  whoEyebrow: "Who we are",
  whoTitle: "Quality management education, made affordable",
  whoParagraphs: [
    "Pokhara College of Management (PCM), affiliated to Pokhara University, was established in 2002 with an unwavering dedication to developing well-educated, confident, creative and adaptive graduates able to make an impact on an organisation\u2019s strategic capability and competitive advantage.",
    "The PCM team firmly believes that quality management education is the need of the hour, as the world transforms into a common business arena. A business leader must understand the global rules to excel in local fields \u2014 and that spirit has guided us from humble beginnings to a college trusted by guardians, students and society alike.",
  ],
  whoPills: [
    "Pokhara University",
    "Nadipur, Pokhara",
    "BBA \u2014 BBA-Finance \u2014 BCSIT",
  ],
  whoImageSrc: "/assets/img/about-1.jpg",
  whoImageAlt: "PCM campus and students",
  whoBadgeValue: "23+",
  whoBadgeLabel: "Years of Trust",

  whyEyebrow: "Why study at PCM?",
  whyTitle: "A balanced approach to management",
  whyParagraphs: [
    "The last two decades of change in information technology have brought unprecedented shifts to the business world. Markets are opening, competition is intensifying, and the horizon of management education is ever-evolving.",
    "Through it all, the time-tested values of management remain a guide. Our programs adopt a well-balanced approach \u2014 inculcating a strong theoretical concept of management alongside an intense realisation of its practical application in real life.",
  ],
  whyImageSrc: "/assets/img/about-2.jpg",
  whyImageAlt: "The PCM campus in Nadipur",
  whyCtaLabel: "See our programs",
  whyCtaHref: "/programs",

  vmvEyebrow: "Vision, Mission & Values",
  vmvTitle: "What we stand for",
  vmvCards: [
    {
      id: "vision",
      iconType: "vision",
      iconBg: "#eef3ff",
      iconColor: "#21409A",
      title: "Vision & Mission",
      description:
        "To identify, develop and unveil the potential of future business leaders who define their own role and boundaries \u2014 and grasp the opportunities of a dynamic new world.",
    },
    {
      id: "values",
      iconType: "values",
      iconBg: "#eaf9ee",
      iconColor: "#3F9E35",
      title: "Core Values",
      description:
        "A value-based organisation promoting discipline, sincerity, hard work and innovation as individual values, and respect, professionalism, fairness, transparency and team spirit as organisational values.",
    },
    {
      id: "objectives",
      iconType: "mission",
      iconBg: "#fff7e8",
      iconColor: "#b98a12",
      title: "Objectives",
      description:
        "To offer highly competitive, professionally oriented education \u2014 equipping students with advanced conceptual, analytical and quantitative techniques for decision-making.",
    },
  ],

  diffEyebrow: "The PCM difference",
  diffTitle: "What makes us different",
  diffItems: [
    {
      id: "faculty",
      iconType: "faculty",
      iconBg: "#eef3ff",
      iconColor: "#21409A",
      title: "Qualified & experienced faculty",
      description:
        "A dedicated faculty pool with extensive experience across management and IT, bringing practical, cutting-edge learning into every classroom.",
    },
    {
      id: "lectures",
      iconType: "lectures",
      iconBg: "#eaf9ee",
      iconColor: "#3F9E35",
      title: "Guest lectures & workshops",
      description:
        "Frequent guest lectures from business and IT industry leaders, plus hands-on workshops, are a regular part of the curriculum.",
    },
    {
      id: "it-courses",
      iconType: "it-courses",
      iconBg: "#fff7e8",
      iconColor: "#b98a12",
      title: "Specialised, updated IT courses",
      description:
        "An IT curriculum integrated with management \u2014 focused on data analytics, cybersecurity, AI and machine learning.",
    },
    {
      id: "extracurriculars",
      iconType: "extracurriculars",
      iconBg: "#fce8f3",
      iconColor: "#9e3f84",
      title: "Vibrant extracurriculars",
      description:
        "Student clubs organise sports, entertainment, art and literature, idea pitching and more \u2014 developing well-rounded graduates.",
    },
    {
      id: "industry",
      iconType: "industry",
      iconBg: "#eef3ff",
      iconColor: "#21409A",
      title: "Strong industry connections",
      description:
        "Corporate ties and industry visits give students real-world exposure well before graduation.",
    },
    {
      id: "student-care",
      iconType: "student-care",
      iconBg: "#eaf9ee",
      iconColor: "#3F9E35",
      title: "Individual student care",
      description:
        "A favourable faculty-to-student ratio ensures personalised mentoring, timely feedback and academic guidance tailored to every learner.",
    },
  ],

  statsEyebrow: "By the numbers",
  statsTitle: "A legacy measured in outcomes",
  stats: [
    { id: "s1", value: "80%", label: "Success stories" },
    { id: "s2", value: "100+", label: "Dean's List Scholars" },
    { id: "s3", value: "1000+", label: "Graduates" },
    { id: "s4", value: "23", label: "Years of Excellence" },
  ],

  voicesEyebrow: "Voices of PCM",
  voicesTitle: "What our achievers say",
  voicesSubtitle:
    "Graduates on the Dean's List reflect on their four-year journey \u2014 the mentorship, the friendships, and the confidence they carry forward.",
  voicesPerPage: 4,

  ctaEyebrow: "Enter to Learn \u2014 Go Forth to Serve",
  ctaTitle: "A step towards your future",
  ctaText:
    "Applications for the 2083 intake are open across all three programs. Take the first step today.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "More Info",
  ctaSecondaryHref: "/about",
};
