// src/types/survey-page-settings.ts
// Dynamic page chrome for the public /survey page.
// Stored in site_settings under key "survey_page".

export interface SurveyPageSettings {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];

  heroTitle: string;
  heroSubtitle: string;

  listEyebrow: string;
  listTitle: string;
  listSubtitle: string;
  perPage: number;

  detailEyebrow: string;
  detailTitle: string;
  detailSubtitle: string;
  submitLabel: string;
  backToListLabel: string;
  thankYouTitle: string;
  thankYouText: string;
  respondentLabel: string;
  respondentHint: string;

  emptyTitle: string;
  emptyText: string;

  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
  ctaHref: string;
}

export const SURVEY_PAGE_SETTINGS_KEY = "survey_page";

export const SURVEY_PAGE_SETTINGS_DEFAULTS: SurveyPageSettings = {
  seoTitle: "Surveys & Polls | Pokhara College of Management",
  seoDescription:
    "Participate in ongoing surveys and polls at PCM — share your experience to help us improve teaching, facilities and student life.",
  seoKeywords: [
    "PCM surveys",
    "Pokhara College of Management poll",
    "student survey PCM",
  ],

  heroTitle: "Surveys & Polls",
  heroSubtitle:
    "Participate in our ongoing surveys and help PCM grow and improve.",

  listEyebrow: "Have your say",
  listTitle: "Active surveys",
  listSubtitle:
    "Click any survey to begin. Your responses are anonymous by default.",
  perPage: 3,

  detailEyebrow: "Your voice matters",
  detailTitle: "Share your experience",
  detailSubtitle:
    "Answer the questions below and submit to help us improve the PCM experience.",
  submitLabel: "Submit Response",
  backToListLabel: "Back to Surveys",
  thankYouTitle: "Thank You!",
  thankYouText:
    "Your response has been recorded. We appreciate your participation.",
  respondentLabel: "Your name",
  respondentHint: "(optional — leave blank for anonymous)",

  emptyTitle: "No Active Surveys",
  emptyText:
    "There are no active surveys at the moment. Please check back soon.",

  ctaEyebrow: "Enter to Learn — Go Forth to Serve",
  ctaTitle: "A step towards your future",
  ctaText:
    "Applications for the current intake are open across all three programs. Take the first step today.",
  ctaLabel: "Apply Now",
  ctaHref: "/admission",
};
