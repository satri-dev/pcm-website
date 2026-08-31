// src/types/events-page-settings.ts
// Dynamic page chrome for the public /events page.
// Stored in site_settings under key "events_page".

export interface EventsPageSettings {
  heroTitle: string;
  heroSubtitle: string;

  sectionEyebrow: string;
  sectionTitle: string;
  sectionSubtitle: string;

  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;

  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

export const EVENTS_PAGE_SETTINGS_KEY = "events_page";

export const EVENTS_PAGE_SETTINGS_DEFAULTS: EventsPageSettings = {
  heroTitle: "Events & Workshops",
  heroSubtitle:
    "Fests, seminars, workshops, tours and competitions - find your next moment at PCM.",

  sectionEyebrow: "Campus calendar",
  sectionTitle: "What\u2019s happening at PCM",
  sectionSubtitle:
    "Upcoming events across the college. Follow along, or join us on campus.",

  ctaEyebrow: "Enter to Learn \u2014 Go Forth to Serve",
  ctaTitle: "A step towards your future",
  ctaText:
    "Applications for the 2083 intake are open across all three programs. Take the first step today.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "Explore Programs",
  ctaSecondaryHref: "/programs",

  seoTitle: "Events & Workshops | Pokhara College of Management",
  seoDescription:
    "Fests, seminars, workshops, tours and competitions — find your next moment at PCM.",
  seoKeywords: [
    "PCM events",
    "Pokhara College of Management workshops",
    "PCM seminars",
    "campus events Pokhara",
    "BBA events Nepal",
  ],
};
