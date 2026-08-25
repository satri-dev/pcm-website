// src/types/news.ts
// Canonical schema mirrors the "news" collection validator in
// scripts/create-news-collection.js

export type NewsCategory = "News" | "Event" | "Student Blog" | "Achievement";
export type NewsStatus = "published" | "draft";

export interface SeoMeta {
  title?: string;
  description?: string;
  keywords?: string[];
}

export const NEWS_CATEGORIES: readonly NewsCategory[] = [
  "News",
  "Event",
  "Student Blog",
  "Achievement",
];

export const NEWS_STATUSES: readonly NewsStatus[] = ["published", "draft"];

export const NEWS_COLLECTION = "news";

// UI-facing shape. publishedAt is a "YYYY-MM-DD" string (matches
// <input type="date">); the repository converts it to a Date for storage.
export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  image?: string;
  author: string;
  publishedAt: string;
  status: NewsStatus;
  views: number;
  featured: boolean;
  tags?: string[];
  seo?: SeoMeta;
  createdAt: string;
  updatedAt: string;
}

// Database document shape ("news" collection)
export interface NewsDocument {
  _id?: import("mongodb").ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  image?: string;
  author: string;
  publishedAt: Date;
  status: NewsStatus;
  views: number;
  featured: boolean;
  tags?: string[];
  seo?: SeoMeta;
  createdAt: Date;
  updatedAt: Date;
}

// Payload accepted by the repository when creating/updating.
// Normalizable fields (featured, views) are optional here; the repository
// fills defaults before writing so the strict validator always passes.
export interface NewsCreateInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  image?: string;
  author: string;
  publishedAt: string;
  status: NewsStatus;
  featured?: boolean;
  tags?: string[];
  seo?: SeoMeta;
  views?: number;
}

export type NewsUpdateInput = Partial<NewsCreateInput>;
