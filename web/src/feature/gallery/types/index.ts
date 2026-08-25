export type MediaType = "photo" | "video";

export type GalleryCategory =
  | "all"
  | "cultural"
  | "academic"
  | "sports"
  | "tour"
  | "albums";

export interface GalleryPhoto {
  id: string;
  albumKey: string;
  category: GalleryCategory;
  tag: string;
  title: string;
  description: string;
  date: string; // "YYYY" or "Mon YYYY"
  src: string;
  alt: string;
}

export interface GalleryAlbum {
  id: string;          // matches albumKey on photos
  title: string;
  category: GalleryCategory;
  date: string;
  coverSrc: string;
  coverAlt: string;
  photoCount: number;
}

export interface GalleryVideo {
  id: string;
  title: string;
  category: GalleryCategory;
  date: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  youtubeId?: string;
  description: string;
}
