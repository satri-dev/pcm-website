"use client";

import { useState, useMemo, useCallback } from "react";
import type { GalleryCategory, GalleryPhoto, GalleryAlbum } from "../types";
import { photos, albums } from "../data/gallery";

export type GalleryTab = "photos" | "videos";

export interface LightboxState {
  open: boolean;
  photos: GalleryPhoto[];
  index: number;
}

export function useGallery() {
  const [tab, setTab] = useState<GalleryTab>("photos");
  const [category, setCategory] = useState<GalleryCategory>("all");
  const [lightbox, setLightbox] = useState<LightboxState>({
    open: false,
    photos: [],
    index: 0,
  });
  // Which album is currently "open" (drilled into), null = album grid view
  const [openAlbumId, setOpenAlbumId] = useState<string | null>(null);

  // Filtered albums for the grid
  const filteredAlbums: GalleryAlbum[] = useMemo(
    () =>
      category === "all"
        ? albums
        : albums.filter((a) => a.category === category),
    [category]
  );

  // Photos for the currently open album
  const albumPhotos: GalleryPhoto[] = useMemo(() => {
    if (!openAlbumId) return [];
    return photos.filter((p) => p.albumKey === openAlbumId);
  }, [openAlbumId]);

  const openAlbum = useCallback((albumId: string) => {
    setOpenAlbumId(albumId);
    setLightbox({ open: false, photos: [], index: 0 });
  }, []);

  const closeAlbum = useCallback(() => {
    setOpenAlbumId(null);
  }, []);

  const openLightbox = useCallback((photo: GalleryPhoto, pool: GalleryPhoto[]) => {
    const index = pool.findIndex((p) => p.id === photo.id);
    setLightbox({ open: true, photos: pool, index: Math.max(0, index) });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox((prev) => ({ ...prev, open: false }));
  }, []);

  const lightboxNext = useCallback(() => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.photos.length,
    }));
  }, []);

  const lightboxPrev = useCallback(() => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index - 1 + prev.photos.length) % prev.photos.length,
    }));
  }, []);

  const changeCategory = useCallback((cat: GalleryCategory) => {
    setCategory(cat);
    setOpenAlbumId(null); // reset album view on filter change
  }, []);

  return {
    tab,
    setTab,
    category,
    changeCategory,
    filteredAlbums,
    openAlbumId,
    openAlbum,
    closeAlbum,
    albumPhotos,
    lightbox,
    openLightbox,
    closeLightbox,
    lightboxNext,
    lightboxPrev,
  };
}
