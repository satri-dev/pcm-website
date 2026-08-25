"use client";

import type { GalleryPhoto } from "../types";

interface Props {
  photo: GalleryPhoto;
  onClick: () => void;
}

const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);

export default function PhotoItem({ photo, onClick }: Props) {
  return (
    <div
      className="gal-photo-item"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      role="button"
      tabIndex={0}
      aria-label={`View photo: ${photo.title}`}
    >
      <div className="gal-photo-item__img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} alt={photo.alt} loading="lazy" />
      </div>
      <div className="gal-photo-item__overlay">
        <span className="gal-photo-item__tag">{photo.tag}</span>
        <b className="gal-photo-item__title">{photo.title}</b>
      </div>
      <span className="gal-photo-item__zoom" aria-hidden="true">
        <ZoomIcon />
      </span>
    </div>
  );
}
