"use client";

import type { GalleryAlbum } from "../types";
import AlbumCard from "./AlbumCard";

interface Props {
  albums: GalleryAlbum[];
  onOpen: (id: string) => void;
}

export default function AlbumGrid({ albums, onOpen }: Props) {
  if (albums.length === 0) {
    return (
      <div className="gal-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
        </svg>
        <p>No albums in this category yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="gal-album-grid">
      {albums.map((album, i) => (
        <div key={album.id} className="reveal" style={{ transitionDelay: `${i * 60}ms` }}>
          <AlbumCard album={album} onClick={onOpen} />
        </div>
      ))}
    </div>
  );
}
