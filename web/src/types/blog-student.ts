// src/types/blog-student.ts
export const BLOG_STUDENT_STATUSES = ["pending", "approved"] as const;
export type BlogStudentStatus = (typeof BLOG_STUDENT_STATUSES)[number];

export const BLOG_STUDENT_CATEGORIES: readonly string[] = [
  "Internships",
  "Campus Life",
  "Academic",
  "Clubs & Societies",
  "Finance",
  "Skills",
  "Events",
  "Other",
];

export const BLOG_STUDENT_COLLECTION = "blog_student";

export interface BlogStudent {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image?: string;
  date: string;
  tag: string;
  author: string;
  category: string;
  status: BlogStudentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface BlogStudentDocument {
  _id?: import("mongodb").ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image?: string;
  date: Date;
  tag: string;
  author: string;
  category: string;
  status: BlogStudentStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface BlogStudentCreateInput {
  title: string;
  slug?: string;
  excerpt: string;
  body?: string;
  image?: string;
  date: string;
  tag?: string;
  author: string;
  category?: string;
}

export interface BlogStudentUpdateInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  image?: string;
  date?: string;
  tag?: string;
  author?: string;
  category?: string;
  status?: BlogStudentStatus;
}

export interface BlogStudentPayload extends BlogStudentCreateInput {
  status: BlogStudentStatus;
}