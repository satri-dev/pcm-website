export type BlogCategory = "Career" | "Finance" | "Technology" | "Student Life" | "Admissions" | "Events" | "Achievement" | "Other";

export const BLOG_CATEGORIES: readonly BlogCategory[] = [
  "Career",
  "Finance",
  "Technology",
  "Student Life",
  "Admissions",
  "Events",
  "Achievement",
  "Other",
];

export const BLOG_STATUSES = ["published", "draft"] as const;
export type BlogStatus = typeof BLOG_STATUSES[number];

export const BLOG_COLLECTION = "blogs";

export interface Blog {
  id: string;
  title: string;
  author: string;
  category: BlogCategory;
  date: string;
  status: BlogStatus;
  excerpt: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogDocument {
  _id?: import("mongodb").ObjectId;
  title: string;
  author: string;
  category: BlogCategory;
  date: Date;
  status: BlogStatus;
  excerpt: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogCreateInput {
  title: string;
  author: string;
  category: BlogCategory;
  date: string;
  status: BlogStatus;
  excerpt: string;
  fileUrl?: string;
  fileName?: string;
}

export type BlogUpdateInput = Partial<BlogCreateInput>;
