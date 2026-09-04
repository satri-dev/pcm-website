// src/types/blog-article-settings.ts
// Dynamic page chrome for the public /blogs/[slug] article detail page.
// Stored in site_settings under key "blog_article".
// The blog content itself lives on the blog document; these settings control
// breadcrumbs, byline, back link, a "useful links" section, related posts
// and SEO defaults.

export interface UsefulLink {
  label: string;
  href: string;
}

export interface BlogArticleSettings {
  breadcrumbLabel: string;
  publishedLabel: string;
  publishedLabelPrefix: string;
  bylinePrefix: string;
  backToAllLabel: string;
  backToAllHref: string;
  usefulLinksTitle: string;
  usefulLinksEyebrow: string;
  usefulLinks: UsefulLink[];
  showUsefulLinks: boolean;
  relatedTitle: string;
  showRelated: boolean;
  seoTitleSuffix: string;
}

export const BLOG_ARTICLE_SETTINGS_KEY = "blog_article";

export const BLOG_ARTICLE_SETTINGS_DEFAULTS: BlogArticleSettings = {
  breadcrumbLabel: "Blog",
  publishedLabel: "Published",
  publishedLabelPrefix: "on",
  bylinePrefix: "By",
  backToAllLabel: "Back to all blogs",
  backToAllHref: "/blogs",
  usefulLinksTitle: "Useful Links",
  usefulLinksEyebrow: "Explore More",
  usefulLinks: [
    { label: "Admissions", href: "/admission" },
    { label: "Programs", href: "/programs" },
  ],
  showUsefulLinks: true,
  relatedTitle: "More from the blog",
  showRelated: true,
  seoTitleSuffix: "| PCM Blog",
};
