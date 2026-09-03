// src/types/message-page-settings.ts
// Configurable page chrome for the public /about/message page: SEO, hero,
// intro section head, and CTA band. The leadership messages themselves come
// from the messages collection (src/app/admin/people/leadership-message) and
// are fetched separately — they are NOT part of these settings.
// Stored in the site_settings collection under key "message_page".

export interface MessagePageSettings {
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;

  // Intro section head
  introEyebrow: string;
  introTitle: string;
  introSubtitle: string;

  // CTA Band
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export const MESSAGE_PAGE_SETTINGS_KEY = "message_page";

export const MESSAGE_PAGE_SETTINGS_DEFAULTS: MessagePageSettings = {
  seoTitle: "Words from our leaders | Pokhara College of Management",
  seoDescription:
    "Words from our leaders — personal messages from the Principal, Chairperson, Advisor and program coordinators of Pokhara College of Management.",
  seoKeywords: [
    "PCM leadership messages",
    "PCM principal message",
    "Pokhara College of Management chairperson",
    "PCM coordinator messages",
  ],
  ogImage: "/assets/img/about-1.jpg",

  heroTitle: "Words from our leaders",
  heroSubtitle:
    "A personal welcome from the leadership team at Pokhara College of Management.",

  introEyebrow: "Leadership voices",
  introTitle: "Words from our leaders",
  introSubtitle:
    "The people guiding PCM share why they believe in our mission of affordable, quality education.",

  ctaTitle: "A step towards your future",
  ctaText:
    "Applications for the 2083 intake are open across all three programs. Take the first step today.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "Explore Programs",
  ctaSecondaryHref: "/programs",
};
