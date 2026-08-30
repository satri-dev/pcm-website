// src/feature/gallery/lib/adapt.ts
// Server-safe adapter: converts admin Gallery documents into the public
// album/photo model used by the gallery page components.

import type { Gallery } from "@/types/gallery";
import type { GalleryAlbum, GalleryCategory, GalleryPhoto } from "../types";

export interface AdaptedGallery {
  albums: GalleryAlbum[];
  photos: GalleryPhoto[];
}

export function formatGalleryDate(date: string): string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return date || "";
  const [y, m, d] = date.split("-").map(Number);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const month = months[m - 1] ?? "";
  return month ? `${month} ${String(d).padStart(2, "0")}, ${y}` : date;
}

export function adaptGalleryItems(items: Gallery[]): AdaptedGallery {
  const albums: GalleryAlbum[] = [];
  const photos: GalleryPhoto[] = [];

  for (const item of items) {
    const galleryPhotos = Array.isArray(item.photos) ? item.photos : [];
    const coverSrc =
      item.image ??
      galleryPhotos[0]?.url ??
      "/assets/img/about-2.jpg";
    const photoCount =
      typeof item.photoCount === "number" && item.photoCount >= 0
        ? item.photoCount
        : galleryPhotos.length;

    albums.push({
      id: item.id,
      title: item.title,
      category: item.category as GalleryCategory,
      date: formatGalleryDate(item.date),
      coverSrc,
      coverAlt: item.title,
      photoCount,
    });

    galleryPhotos.forEach((photo, i) => {
      const title = photo.title?.trim() || item.title;
      const tag = photo.tags?.[0]?.trim() || item.category;
      photos.push({
        id: `${item.id}-photo-${i}`,
        albumKey: item.id,
        category: item.category as GalleryCategory,
        tag,
        title,
        description: photo.tags?.slice(1).join(", ") ?? "",
        date: formatGalleryDate(item.date),
        src: photo.url,
        alt: title,
      });
    });
  }

  return { albums, photos };
}
