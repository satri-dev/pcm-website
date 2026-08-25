export type GalleryCategory = "Campus" | "Events" | "Students" | "Faculty" | "Activities" | "Infrastructure" | "Graduation";

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

export interface GalleryPhoto {
  url: string;
  title?: string;
  tags?: string[];
}

export interface Gallery {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
  photos: GalleryPhoto[];
  date: string;
  photoCount: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryDocument {
  _id?: import("mongodb").ObjectId;
  title: string;
  category: GalleryCategory;
  image: string;
  photos: GalleryPhoto[];
  date: string;
  photoCount: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryCreateInput {
  title: string;
  category: GalleryCategory;
  image: string;
  photos: GalleryPhoto[];
  date: string;
  photoCount: number;
  views?: number;
}

export type GalleryUpdateInput = Partial<GalleryCreateInput>;
