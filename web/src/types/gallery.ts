// Categories are dynamic — admins can add new ones at any time. GALLERY_CATEGORIES
// below is only a suggested/default list used in the admin form's datalist.
export type GalleryCategory = string;

export const GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  "Campus",
  "Events",
  "Students",
  "Faculty",
  "Activities",
  "Infrastructure",
  "Graduation",
];

export const GALLERY_COLLECTION = "gallery";

export type GalleryMediaType = "photo" | "video";

export interface GalleryPhoto {
  url: string;
  title?: string;
  tags?: string[];
}

export interface GalleryVideo {
  url: string;
  title?: string;
  tags?: string[];
}

export interface Gallery {
  id: string;
  title: string;
  category: GalleryCategory;
  type?: GalleryMediaType;
  image?: string;
  photos: GalleryPhoto[];
  videos?: GalleryVideo[];
  date: string;
  photoCount: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface GalleryDocument {
  _id?: import("mongodb").ObjectId;
  title: string;
  category: GalleryCategory;
  type?: GalleryMediaType;
  image?: string;
  photos: GalleryPhoto[];
  videos?: GalleryVideo[];
  date: string;
  photoCount: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface GalleryCreateInput {
  title: string;
  category: GalleryCategory;
  type?: GalleryMediaType;
  image?: string;
  photos?: GalleryPhoto[];
  videos?: GalleryVideo[];
  date: string;
  photoCount?: number;
  views?: number;
}

export type GalleryUpdateInput = Partial<GalleryCreateInput>;
