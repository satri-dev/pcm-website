"use client";

import type { GalleryPhoto } from "../types";
import PhotoItem from "./PhotoItem";

interface Props {
  photos: GalleryPhoto[];
  albumTitle: string;
  onBack: () => void;
  onPhotoClick: (photo: GalleryPhoto) => void;
}

const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export default function PhotoGrid({ photos, albumTitle, onBack, onPhotoClick }: Props) {
  return (
    <div className="gal-photo-grid-wrap">
      <div className="gal-album-header">
        <button className="gal-back-btn" onClick={onBack} aria-label="Back to albums">
          <BackIcon /> All Albums
        </button>
        <h2 className="gal-album-title">{albumTitle}</h2>
        <span className="gal-album-count">{photos.length} photos</span>
      </div>
      <div className="gal-photo-grid">
        {photos.map((photo, i) => (
          <div key={photo.id} className="reveal" style={{ transitionDelay: `${i * 50}ms` }}>
            <PhotoItem photo={photo} onClick={() => onPhotoClick(photo)} />
          </div>
        ))}
      </div>
    </div>
  );
}
