// src/types/facilities.ts
// Canonical schema for the "facilities" collection

export type FacilityCategory = string;

export type FacilityStatus = "published" | "draft";

export const FACILITY_CATEGORIES: readonly FacilityCategory[] = [
  "Learning",
  "Library",
  "IT",
  "Sports",
  "Student Life",
];

export const FACILITY_STATUSES: readonly FacilityStatus[] = [
  "published",
  "draft",
];

export const FACILITY_COLLECTION = "facilities";

// UI-facing shape — used by the frontend and hook
export interface FacilityItem {
  id: string;
  name: string;
  category: FacilityCategory;
  icon: string; // emoji or short text
  image?: string; // Cloudinary URL or external URL
  description: string; // HTML from rich text editor
  status: FacilityStatus;
  order: number; // display sort order
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

// Database document shape ("facilities" collection)
export interface FacilityDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  category: FacilityCategory;
  icon: string;
  image?: string;
  description: string;
  status: FacilityStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

// Payload accepted by the repository when creating/updating
export interface FacilityCreateInput {
  name: string;
  category: FacilityCategory;
  icon: string;
  image?: string;
  description: string;
  status: FacilityStatus;
  order?: number;
}

export type FacilityUpdateInput = Partial<FacilityCreateInput>;
