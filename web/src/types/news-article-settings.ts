// src/types/news-article-settings.ts
// Dynamic page chrome for the public /news/[slug] article detail page.
// Stored in site_settings under key "news_article".

export interface NewsArticleSettings {
  breadcrumbLabel: string;
  publishedLabel: string;
  publishedLabelPrefix: string;
  bylinePrefix: string;
  backToAllLabel: string;
  backToAllHref: string;
  relatedTitle: string;
  showRelated: boolean;
  seoTitleSuffix: string;
}

export const NEWS_ARTICLE_SETTINGS_KEY = "news_article";

export const NEWS_ARTICLE_SETTINGS_DEFAULTS: NewsArticleSettings = {
  breadcrumbLabel: "News",
  publishedLabel: "Published",
  publishedLabelPrefix: "on",
  bylinePrefix: "By",
  backToAllLabel: "Back to all news",
  backToAllHref: "/news",
  relatedTitle: "More stories",
  showRelated: true,
  seoTitleSuffix: "| PCM News",
};
