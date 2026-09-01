// src/types/scholarship-page-settings.ts
// Dynamic page chrome for the public /scholarship page (hero, headings,
// how-to-apply, FAQs, CTA band, SEO). The actual scholarship schemes are
// managed as a collection via /admin/content/scholarships and fetched with
// the published list — they are NOT part of these page settings.
// Stored in the site_settings collection under key "scholarship_page".

export interface ScholarshipStepData {
  id: string;
  text: string;
}

export interface ScholarshipFaqData {
  id: string;
  question: string;
  answer: string;
}

export interface ScholarshipPageSettings {
  // Hero
  heroTitle: string;
  heroSubtitle: string;

  // Ways we support you (section headings — schemes come from the content
  // collection /admin/content/scholarships)
  supportEyebrow: string;
  supportTitle: string;
  supportSubtitle: string;

  // How to apply
  applyEyebrow: string;
  applyTitle: string;
  applySubtitle: string;
  applySteps: ScholarshipStepData[];
  applyImageSrc: string;
  applyImageAlt: string;
  applyCtaLabel: string;
  applyCtaHref: string;

  // FAQs
  faqEyebrow: string;
  faqTitle: string;
  faqSubtitle: string;
  faqs: ScholarshipFaqData[];

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

export const SCHOLARSHIP_PAGE_SETTINGS_KEY = "scholarship_page";

export const SCHOLARSHIP_PAGE_SETTINGS_DEFAULTS: ScholarshipPageSettings = {
  heroTitle: "Scholarships at PCM",
  heroSubtitle:
    "We believe financial barriers should never stand in the way of a quality education. Explore how PCM supports deserving students.",

  supportEyebrow: "Support programmes",
  supportTitle: "Ways we support you",
  supportSubtitle:
    "Four distinct pathways to make your studies at PCM more affordable.",

  applyEyebrow: "Simple process",
  applyTitle: "How to apply",
  applySubtitle:
    "Scholarship consideration is built into the admission process — no separate application needed in most cases.",
  applySteps: [
    { id: "step-1", text: "Indicate your interest in a scholarship on your admission form." },
    { id: "step-2", text: "Sit the entrance examination — many awards are merit-based on your result." },
    { id: "step-3", text: "Submit supporting documents for need-based or category awards." },
    { id: "step-4", text: "Attend a short counselling meeting with the scholarship committee." },
    { id: "step-5", text: "Receive your decision along with your admission offer." },
  ],
  applyImageSrc: "/assets/img/about-1.jpg",
  applyImageAlt: "Students at PCM campus",
  applyCtaLabel: "Start your application",
  applyCtaHref: "/admission",

  faqEyebrow: "Common questions",
  faqTitle: "Scholarship FAQs",
  faqSubtitle: "A few quick answers to what students ask most.",
  faqs: [
    {
      id: "sfaq-1",
      question: "Can I hold more than one scholarship?",
      answer:
        "Awards are generally not combined, but the committee will always apply the option most beneficial to you.",
    },
    {
      id: "sfaq-2",
      question: "Do I need to reapply every year?",
      answer:
        "Merit continuation depends on maintaining strong semester results. The committee reviews renewals annually.",
    },
    {
      id: "sfaq-3",
      question: "Who can I ask for details?",
      answer:
        "Reach the admissions office at info@pcm.edu.np or (061) 544761 — we're happy to talk you through the options.",
    },
  ],

  ctaEyebrow: "Enter to Learn — Go Forth to Serve",
  ctaTitle: "Talk to us about scholarships",
  ctaText:
    "Our admissions team is happy to walk you through every option and help you find the support that fits.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "More Info",
  ctaSecondaryHref: "/contact",

  seoTitle: "Scholarships | Pokhara College of Management",
  seoDescription:
    "PCM offers merit-based, Pokhara University, need-based and category scholarships. Learn how to apply and get financial support for your BBA or BCSIT studies.",
  seoKeywords: [
    "PCM scholarships",
    "Pokhara College of Management financial aid",
    "merit scholarship BBA",
    "BCSIT scholarship Nepal",
    "Pokhara University scholarship",
    "need-based scholarship PCM",
  ],
  ogImage: "/assets/img/about-graduation.jpg",
};
