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
  slug: string;
  title: string;
  author: string;
  category: BlogCategory;
  date: string;
  status: BlogStatus;
  excerpt: string;
  fileUrl?: string;
  fileName?: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface BlogDocument {
  _id?: import("mongodb").ObjectId;
  slug: string;
  title: string;
  author: string;
  category: BlogCategory;
  date: Date;
  status: BlogStatus;
  excerpt: string;
  fileUrl?: string;
  fileName?: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface BlogCreateInput {
  slug: string;
  title: string;
  author: string;
  category: BlogCategory;
  date: string;
  status: BlogStatus;
  excerpt: string;
  fileUrl?: string;
  fileName?: string;
  thumbnail?: string;
}

export type BlogUpdateInput = Partial<BlogCreateInput>;
