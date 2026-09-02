// src/types/alumni-page-settings.ts
// Dynamic page chrome for the public /alumni page (hero, intro, section
// headings, career paths, CTA band, SEO). The individual alumni records are
// managed as a collection via /admin/people/alumni and are fetched with the
// published list — they are NOT part of these page settings.
// Stored in the site_settings collection under key "alumni_page".

export type AlumniPathIconType = "bank" | "tech" | "entrepreneurship" | "education";

export interface AlumniPathData {
  id: string;
  iconType: AlumniPathIconType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface AlumniPageSettings {
  // Hero
  heroTitle: string;
  heroSubtitle: string;

  // Alumni family (split intro)
  familyEyebrow: string;
  familyTitle: string;
  familyParagraphs: string[];
  familyPills: string[];
  familyImageSrc: string;
  familyImageAlt: string;
  badgeValue: string;
  badgeLabel: string;

  // Alumni spotlight (section headings — records come from the collection)
  spotlightEyebrow: string;
  spotlightTitle: string;
  spotlightSubtitle: string;

  // Career paths
  pathsEyebrow: string;
  pathsTitle: string;
  careerPaths: AlumniPathData[];

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

export const ALUMNI_PAGE_SETTINGS_KEY = "alumni_page";

export const ALUMNI_PAGE_SETTINGS_DEFAULTS: AlumniPageSettings = {
  heroTitle: "Alumni Network",
  heroSubtitle:
    "Meet the graduates of Pokhara College of Management — 1000+ professionals in banking, technology, entrepreneurship and more.",

  familyEyebrow: "Our alumni family",
  familyTitle: "A network that stays connected",
  familyParagraphs: [
    "Since 2002, PCM has produced 1000+ graduates who now lead teams, build companies and shape industries across Nepal and beyond. Our alumni network keeps that community connected through events, mentorship and opportunities.",
    "Whatever your year or program, the doors of PCM never close — alumni regularly return to guest-lecture, mentor current students and support placement drives.",
  ],
  familyPills: [
    "1000+ Graduates",
    "Banking & Finance",
    "Technology",
    "Entrepreneurship",
  ],
  familyImageSrc: "/images/about-graduation.jpg",
  familyImageAlt: "PCM graduates in caps and gowns",
  badgeValue: "1000+",
  badgeLabel: "Graduates",

  spotlightEyebrow: "Alumni spotlight",
  spotlightTitle: "Meet our graduates",
  spotlightSubtitle:
    "A few of the 1000+ PCM alumni making an impact in banking, technology, education and entrepreneurship.",

  pathsEyebrow: "Where they go",
  pathsTitle: "Alumni in the world",
  careerPaths: [
    {
      id: "banking",
      iconType: "bank",
      iconBg: "#eef3ff",
      iconColor: "#21409A",
      title: "Banking & Finance",
      description:
        "Graduates work at Nabil, Himalayan, NIC Asia, Mega and other leading banks and financial institutions.",
    },
    {
      id: "tech",
      iconType: "tech",
      iconBg: "#eaf9ee",
      iconColor: "#3F9E35",
      title: "Technology & Software",
      description:
        "BCSIT alumni build software and systems at Nepali startups, IT firms and global product companies.",
    },
    {
      id: "entrepreneurship",
      iconType: "entrepreneurship",
      iconBg: "#fff7e8",
      iconColor: "#b98a12",
      title: "Entrepreneurship",
      description:
        "From cafés to fintech, many PCM graduates launch their own ventures — supported by our culture of enterprise.",
    },
    {
      id: "education",
      iconType: "education",
      iconBg: "#eef3ff",
      iconColor: "#21409A",
      title: "Education & Research",
      description:
        "Many alumni pursue master's degrees at home and abroad, and give back as educators and mentors.",
    },
  ],

  ctaEyebrow: "Enter to Learn — Go Forth to Serve",
  ctaTitle: "A step towards your future",
  ctaText:
    "Applications for the 2083 intake are open across all three programs. Take the first step today.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "Explore Programs",
  ctaSecondaryHref: "/programs",

  seoTitle: "Alumni Network | Pokhara College of Management",
  seoDescription:
    "Meet the graduates of Pokhara College of Management — 1000+ professionals in banking, technology, entrepreneurship and beyond.",
  seoKeywords: [
    "PCM alumni",
    "Pokhara College of Management graduates",
    "BBA alumni Nepal",
    "BCSIT alumni",
    "PCM career network",
    "PCM entrepreneurship alumni",
  ],
  ogImage: "/images/about-graduation.jpg",
};