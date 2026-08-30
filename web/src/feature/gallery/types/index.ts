export type MediaType = "photo" | "video";

// Categories are dynamic — they are derived from the albums stored in the
// backend, so any category added in the database automatically appears in the
// public gallery filter. The special value "all" means "show everything".
export type GalleryCategory = string;

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
