// src/feature/gallery/lib/adapt.ts
// Server-safe adapter: converts admin Gallery documents into the public
// album/photo model used by the gallery page components.

import type { Gallery } from "@/types/gallery";
import type {
  GalleryAlbum,
  GalleryCategory,
  GalleryPhoto,
  GalleryVideo,
} from "../types";

export interface AdaptedGallery {
  albums: GalleryAlbum[];
  photos: GalleryPhoto[];
  videos: GalleryVideo[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
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

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

/**
 * Adapts DB-paginated photo albums into UI albums + extracts all photos.
 * The `items` are already paginated by MongoDB skip/limit.
 */
export function adaptPaginatedAlbums(
  items: Gallery[],
  dbResult: { total: number; page: number; pageSize: number; pages: number }
): { albums: PaginatedResult<GalleryAlbum>; photos: GalleryPhoto[] } {
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

  return {
    albums: {
      items: albums,
      total: dbResult.total,
      page: dbResult.page,
      pageSize: dbResult.pageSize,
      pages: dbResult.pages,
    },
    photos,
  };
}

/**
 * Adapts DB-paginated video items into UI videos.
 * The `items` are already paginated by MongoDB skip/limit.
 */
export function adaptPaginatedVideos(
  items: Gallery[],
  dbResult: { total: number; page: number; pageSize: number; pages: number }
): PaginatedResult<GalleryVideo> {
  const videos: GalleryVideo[] = [];

  for (const item of items) {
    const galleryVideos = Array.isArray(item.videos) ? item.videos : [];
    galleryVideos.forEach((video, i) => {
      const title = video.title?.trim() || item.title;
      const ytId = extractYouTubeId(video.url);
      videos.push({
        id: `${item.id}-video-${i}`,
        title,
        category: item.category as GalleryCategory,
        date: formatGalleryDate(item.date),
        thumbnailSrc: ytId
          ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
          : "/assets/img/about-2.jpg",
        thumbnailAlt: title,
        youtubeId: ytId || undefined,
        description: video.tags?.join(", ") ?? "",
      });
    });
  }

  return {
    items: videos,
    total: dbResult.total,
    page: dbResult.page,
    pageSize: dbResult.pageSize,
    pages: dbResult.pages,
  };
}

/** Legacy adapter — used by homepage gallery section. */
export function adaptGalleryItems(items: Gallery[]): AdaptedGallery {
  const albums: GalleryAlbum[] = [];
  const photos: GalleryPhoto[] = [];
  const videos: GalleryVideo[] = [];

  for (const item of items) {
    const isVideoItem = item.type === "video";

    if (isVideoItem) {
      const galleryVideos = Array.isArray(item.videos) ? item.videos : [];
      galleryVideos.forEach((video, i) => {
        const title = video.title?.trim() || item.title;
        const ytId = extractYouTubeId(video.url);
        videos.push({
          id: `${item.id}-video-${i}`,
          title,
          category: item.category as GalleryCategory,
          date: formatGalleryDate(item.date),
          thumbnailSrc: ytId
            ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
            : "/assets/img/about-2.jpg",
          thumbnailAlt: title,
          youtubeId: ytId || undefined,
          description: video.tags?.join(", ") ?? "",
        });
      });
      continue;
    }

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

  return { albums, photos, videos };
}
