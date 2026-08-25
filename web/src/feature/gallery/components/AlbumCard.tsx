"use client";

import type { GalleryAlbum } from "../types";

interface Props {
  album: GalleryAlbum;
  onClick: (id: string) => void;
}

const PhotoCountIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
  </svg>
);

export default function AlbumCard({ album, onClick }: Props) {
  return (
    <article
      className="gal-card"
      onClick={() => onClick(album.id)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(album.id); } }}
      role="button"
      tabIndex={0}
      aria-label={`Open album: ${album.title}`}
    >
      <div className="gal-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={album.coverSrc} alt={album.coverAlt} loading="lazy" />
        <span className="gal-card__count">
          <PhotoCountIcon />
          {album.photoCount}
        </span>
      </div>
      <div className="gal-card__body">
        <span className="gal-card__tag">{album.category.charAt(0).toUpperCase() + album.category.slice(1)}</span>
        <h3>{album.title}</h3>
        <small>{album.date} &middot; {album.photoCount} Photos</small>
      </div>
    </article>
  );
}
