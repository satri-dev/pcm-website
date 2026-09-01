// src/types/careers-page-settings.ts
// Dynamic content for the public /career page.
// Stored in the site_settings collection under key "careers_page".

export type JobIconType = "management" | "tech" | "lab" | "admin";
export type JobType = "Full-time" | "Part-time" | "Contract";
export type BenefitIconType = "culture" | "growth" | "impact";

export interface CareerJobData {
  id: string;
  title: string;
  department: string;
  type: JobType;
  iconType: JobIconType;
  iconBg: string;
  iconColor: string;
  description: string;
  requirements: string;
  applyEmail: string;
  applySubject: string;
}

export interface CareerStepData {
  id: string;
  text: string;
}

export interface CareerBenefitData {
  id: string;
  iconType: BenefitIconType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface CareersPageSettings {
  // Hero
  heroTitle: string;
  heroSubtitle: string;

  // Current openings
  openingsEyebrow: string;
  openingsTitle: string;
  openingsSubtitle: string;
  openings: CareerJobData[];

  // How to apply
  applyEyebrow: string;
  applyTitle: string;
  applyParagraph: string;
  applySteps: CareerStepData[];
  applyPills: string[];
  applyImageSrc: string;
  applyImageAlt: string;

  // Why work at PCM
  benefitsEyebrow: string;
  benefitsTitle: string;
  benefitsSubtitle: string;
  benefits: CareerBenefitData[];

  // CTA Band
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaEmailAddress: string;
  ctaEmailSubject: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;

  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string;
}

export const CAREERS_PAGE_SETTINGS_KEY = "careers_page";

export const CAREERS_PAGE_SETTINGS_DEFAULTS: CareersPageSettings = {
  heroTitle: "Careers at PCM",
  heroSubtitle:
    "Join a team that cares about education — current openings at Pokhara College of Management.",

  openingsEyebrow: "Work with us",
  openingsTitle: "Current openings",
  openingsSubtitle:
    "We are always looking for passionate educators and committed staff. Positions are filled as vacancies arise.",
  openings: [
    {
      id: "faculty-mgmt",
      title: "Faculty – Management",
      department: "Management",
      type: "Full-time",
      iconType: "management",
      iconBg: "#eef3ff",
      iconColor: "#21409A",
      description:
        "Teaching positions in BBA and BBA-Finance across subjects such as accounting, finance, marketing and human resources.",
      requirements:
        "Master's degree required; prior teaching experience preferred.",
      applyEmail: "careers@pcm.edu.np",
      applySubject: "Application: Faculty - Management",
    },
    {
      id: "faculty-bcsit",
      title: "Faculty – BCSIT & Computing",
      department: "Technology",
      type: "Full-time",
      iconType: "tech",
      iconBg: "#eaf9ee",
      iconColor: "#3F9E35",
      description:
        "Teaching positions in programming, database, networking and software engineering for the BCSIT program.",
      requirements:
        "Strong technical background and industry experience valued.",
      applyEmail: "careers@pcm.edu.np",
      applySubject: "Application: Faculty - BCSIT",
    },
    {
      id: "lab-assistant",
      title: "Lab Assistant – IT",
      department: "Technology",
      type: "Full-time",
      iconType: "lab",
      iconBg: "#fff7e8",
      iconColor: "#b98a12",
      description:
        "Support for our computer labs — setup, maintenance and student assistance during practical sessions.",
      requirements: "Diploma or Bachelor's in IT-related field.",
      applyEmail: "careers@pcm.edu.np",
      applySubject: "Application: Lab Assistant - IT",
    },
    {
      id: "admin-staff",
      title: "Administrative Staff",
      department: "Administration",
      type: "Full-time",
      iconType: "admin",
      iconBg: "#fdeff0",
      iconColor: "#c0392b",
      description:
        "Support roles in admissions, examinations, accounts and office administration.",
      requirements:
        "Strong communication and organisational skills required.",
      applyEmail: "careers@pcm.edu.np",
      applySubject: "Application: Administrative Staff",
    },
  ],

  applyEyebrow: "How to apply",
  applyTitle: "A simple, transparent process",
  applyParagraph:
    "We welcome applications from qualified candidates who share our commitment to quality education.",
  applySteps: [
    { id: "s1", text: "Send your CV and cover letter to careers@pcm.edu.np" },
    { id: "s2", text: "Shortlisted candidates are invited for an interview" },
    { id: "s3", text: "Faculty roles include a demonstration class" },
    { id: "s4", text: "Offer and onboarding within two weeks of selection" },
  ],
  applyPills: ["Send CV", "Interview", "Demo Class", "Offer"],
  applyImageSrc: "/assets/img/hero-3.jpg",
  applyImageAlt: "PCM campus and classrooms",

  benefitsEyebrow: "Why work at PCM",
  benefitsTitle: "A place where good teaching thrives",
  benefitsSubtitle:
    "Our faculty and staff are the heart of the college — we invest in them.",
  benefits: [
    {
      id: "culture",
      iconType: "culture",
      iconBg: "#eef3ff",
      iconColor: "#21409A",
      title: "Supportive culture",
      description:
        "A collegial environment where teaching quality is celebrated and ideas are welcomed.",
    },
    {
      id: "growth",
      iconType: "growth",
      iconBg: "#eaf9ee",
      iconColor: "#3F9E35",
      title: "Professional growth",
      description:
        "Opportunities for training, workshops and academic development throughout the year.",
    },
    {
      id: "impact",
      iconType: "impact",
      iconBg: "#fff7e8",
      iconColor: "#b98a12",
      title: "Meaningful work",
      description:
        "Help shape the careers of hundreds of students who go on to lead across Nepal and beyond.",
    },
  ],

  ctaEyebrow: "Enter to Learn — Go Forth to Serve",
  ctaTitle: "Ready to join our team?",
  ctaText: "Send your CV and cover letter — we would love to hear from you.",
  ctaEmailAddress: "careers@pcm.edu.np",
  ctaEmailSubject: "Job Application - PCM",
  ctaPrimaryLabel: "Email careers@pcm.edu.np",
  ctaSecondaryLabel: "Contact the college",
  ctaSecondaryHref: "/contact",

  seoTitle: "Careers | Pokhara College of Management",
  seoDescription:
    "Careers at PCM — current faculty, staff and administrative openings. Join a team that shapes the next generation of Nepal's business and tech leaders.",
  seoKeywords: [
    "PCM careers",
    "faculty jobs PCM",
    "teaching jobs Pokhara",
    "BCSIT faculty",
    "management faculty Nepal",
    "PCM job openings",
  ],
  ogImage: "/assets/img/hero-3.jpg",
};
