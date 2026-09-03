// src/lib/cache-tags.ts
// Shared cache tag constants. The fetch side (lib/data) and the
// invalidation side (admin API routes) must never drift apart — always
// reference these constants instead of duplicating string literals.

export const CACHE_TAGS = {
  // Navigation
  navMenu: "nav-menu",
  navbar: "navbar",
  
  // Programs
  programsList: "programs-list",
  program: (slug: string) => `program-${slug}`,
  
  // Page Content
  pageContent: (slug: string) => `page-content-${slug}`,
  
  // FAQs
  faqPage: "faq-page",
  faqs: "faqs",
  
  // Homepage
  homepage: "homepage",
  
  // About
  about: "about",
  aboutSettings: "about-settings",

  // Board of Directors
  boardList: "board-list",
  boardSettings: "board-settings",

  // Faculty & Staff
  facultyList: "faculty-list",
  facultySettings: "faculty-settings",

  // Campus & Facilities
  facilitiesList: "facilities-list",
  facilitiesSettings: "facilities-settings",

  // Campus Map
  campusMapList: "campus-map-list",
  campusMapSettings: "campus-map-settings",

  // Leadership Messages
  messageList: "message-list",
  messageSettings: "message-settings",

  // Clubs
  clubsList: "clubs-list",
  clubsSettings: "clubs-settings",

  // Life at PCM
  lifeSettings: "life-settings",
  
  // Gallery
  galleryList: "gallery-list",
  gallery: (id: string) => `gallery-${id}`,
  
  // News
  newsList: "news-list",
  news: (slug: string) => `news-${slug}`,
  newsSettings: "news-settings",
  newsArticleSettings: "news-article-settings",
  
  // Notices
  noticesList: "notices-list",
  notice: (slug: string) => `notice-${slug}`,
  noticesSettings: "notices-settings",
  
  // Events
  eventsList: "events-list",
  event: (slug: string) => `event-${slug}`,
  eventsSettings: "events-settings",
  
  // Results
  resultsList: "results-list",
  result: (slug: string) => `result-${slug}`,
  resultsSettings: "results-settings",
  
  // Footer
  footerSettings: "footer-settings",
  footerLinks: "footer-links",
  
  // TopBar
  topBarLinks: "topbar-links",
  topBarContact: "topbar-contact",
  
  // Downloads
  downloads: "downloads",
  downloadsSettings: "downloads-settings",
  
  // Placements
  placementsSettings: "placements-settings",

  // Careers
  careersSettings: "careers-settings",

  // Scholarships
  scholarshipsList: "scholarships-list",
  scholarshipPageSettings: "scholarship-page-settings",

  // Alumni
  alumniList: "alumni-list",
  alumniSettings: "alumni-settings",

  // Chatbot
  chatbot: "chatbot",
  
  // Contact
  contact: "contact",

  // Admission Modal
  admissionModal: "admission-modal",
} as const;
