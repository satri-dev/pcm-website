// src/lib/cache-tags.ts
// Central registry of cache tags for updateTag() calls

export const CACHE_TAGS = {
  // Programs
  programsList: "programs-list",
  program: (slug: string) => `program-${slug}`,
  
  // Page Content
  pageContent: (slug: string) => `page-content-${slug}`,
  
  // Gallery
  galleryList: "gallery-list",
  gallery: (id: string) => `gallery-${id}`,
  
  // News
  newsList: "news-list",
  news: (slug: string) => `news-${slug}`,
  
  // Notices
  noticesList: "notices-list",
  notice: (slug: string) => `notice-${slug}`,
  
  // Events
  eventsList: "events-list",
  event: (slug: string) => `event-${slug}`,
  
  // Results
  resultsList: "results-list",
  result: (slug: string) => `result-${slug}`,
} as const;
