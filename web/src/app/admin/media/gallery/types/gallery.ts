// Categories are dynamic — admins can add new ones at any time. GALLERY_CATEGORIES
// below is only a suggested/default list used in the admin form's datalist.
export type GalleryCategory = string;
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
  deletedAt?: string;
  deletedBy?: string;
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
  deletedAt?: Date;
  deletedBy?: string;
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
