export type GalleryCategory = "Campus" | "Events" | "Students" | "Faculty" | "Activities" | "Infrastructure" | "Graduation";
export type GalleryStatus = "published" | "draft";

export const GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  "Campus",
  "Events",
  "Students",
  "Faculty",
  "Activities",
  "Infrastructure",
  "Graduation",
];

export const GALLERY_STATUSES: readonly GalleryStatus[] = ["published", "draft"];

export const GALLERY_COLLECTION = "gallery";

export interface Gallery {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
  description: string;
  date: string;
  status: GalleryStatus;
  views: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryDocument {
  _id?: import("mongodb").ObjectId;
  title: string;
  category: GalleryCategory;
  image: string;
  description: string;
  date: Date;
  status: GalleryStatus;
  views: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryCreateInput {
  title: string;
  category: GalleryCategory;
  image: string;
  description: string;
  date: string;
  status: GalleryStatus;
  featured?: boolean;
  views?: number;
}

export type GalleryUpdateInput = Partial<GalleryCreateInput>;
