// src/types/blog-page-settings.ts
// Configurable chrome for the public /blogs page. Everything the admin can
// edit (SEO, hero, articles intro, CTA band) lives here and is persisted in the
// site_settings collection under key "blog_page".

export interface BlogPageSettings {
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;
  breadcrumbLabel: string;

  // Articles intro
  articlesEyebrow: string;
  articlesTitle: string;
  articlesSubtitle: string;

  // CTA band
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export const BLOG_PAGE_SETTINGS_KEY = "blog_page";

export const BLOG_PAGE_SETTINGS_DEFAULTS: BlogPageSettings = {
  seoTitle: "Blog & Articles | Pokhara College of Management",
  seoDescription:
    "Career guidance, industry trends and practical advice for students and parents — the official blog of Pokhara College of Management.",
  seoKeywords: [
    "PCM blog",
    "Pokhara College of Management articles",
    "career guidance PCM",
  ],
  ogImage: "/assets/img/hero-3.jpg",

  heroTitle: "PCM Blog & Articles",
  heroSubtitle:
    "Ideas, insights and stories from the Pokhara College of Management community.",
  breadcrumbLabel: "Articles",

  articlesEyebrow: "Articles",
  articlesTitle: "Latest articles",
  articlesSubtitle:
    "Career guidance, industry trends and practical advice for students and parents.",

  ctaEyebrow: "Enter to Learn — Go Forth to Serve",
  ctaTitle: "A step towards your future",
  ctaText:
    "Applications for the 2083 intake are open across all three programs. Take the first step today.",
  ctaPrimaryLabel: "Apply Now",
  ctaPrimaryHref: "/admission",
  ctaSecondaryLabel: "Explore Programs",
  ctaSecondaryHref: "/programs",
};
