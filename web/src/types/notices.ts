// src/types/notices.ts
// Canonical schema for the "notices" collection

export type NoticeCategory = string;

export type NoticeStatus = "published" | "draft";

export const NOTICE_CATEGORIES: readonly string[] = [
  "General",
  "Academic",
  "Examination",
  "Administrative",
  "Event",
  "Circular",
];

export const NOTICE_STATUSES: readonly NoticeStatus[] = ["published", "draft"];

export const NOTICE_COLLECTION = "notices";

// UI-facing shape. date is a "YYYY-MM-DD" string (matches <input type="date">);
// the repository converts it to a Date for storage.
export interface Notice {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: NoticeCategory;
  date: string;
  status: NoticeStatus;
  views: number;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

// Database document shape ("notices" collection)
export interface NoticeDocument {
  _id?: import("mongodb").ObjectId;
  title: string;
  slug: string;
  description: string;
  category: NoticeCategory;
  date: Date;
  status: NoticeStatus;
  views: number;
  fileUrl?: string;
  fileName?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

// Payload accepted by the repository when creating/updating.
export interface NoticeCreateInput {
  title: string;
  slug: string;
  description: string;
  category: NoticeCategory;
  date: string;
  status: NoticeStatus;
  fileUrl?: string;
  fileName?: string;
  views?: number;
}

export type NoticeUpdateInput = Partial<NoticeCreateInput>;
