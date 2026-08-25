"use client";

import { useEffect, useCallback } from "react";
import type { LightboxState } from "../hooks/useGallery";

interface Props {
  state: LightboxState;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const PrevIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
const NextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function Lightbox({ state, onClose, onNext, onPrev }: Props) {
  const { open, photos, index } = state;
  const photo = photos[index];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [open, onClose, onNext, onPrev]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open || !photo) return null;

  return (
    <div className="gal-lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
      {/* Scrim */}
      <div className="gal-lightbox__scrim" onClick={onClose} />

      <div className="gal-lightbox__dialog">
        {/* Close */}
        <button className="gal-lightbox__close" onClick={onClose} aria-label="Close viewer">
          <CloseIcon />
        </button>

        {/* Prev */}
        {photos.length > 1 && (
          <button className="gal-lightbox__arrow gal-lightbox__arrow--prev" onClick={onPrev} aria-label="Previous image">
            <PrevIcon />
          </button>
        )}

        {/* Image */}
        <div className="gal-lightbox__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.src} alt={photo.alt} />
        </div>

        {/* Info */}
        <div className="gal-lightbox__info">
          <span className="gal-tag">{photo.tag}</span>
          <h3 className="gal-lightbox__title">{photo.title}</h3>
          <p className="gal-lightbox__desc">{photo.description}</p>
          <div className="gal-lightbox__meta">
            <div>
              <span>Category</span>
              <b>{photo.category.charAt(0).toUpperCase() + photo.category.slice(1)}</b>
            </div>
            <div>
              <span>Captured</span>
              <b>{photo.date}</b>
            </div>
            <div>
              <span>Photo</span>
              <b>{index + 1} / {photos.length}</b>
            </div>
          </div>
        </div>

        {/* Next */}
        {photos.length > 1 && (
          <button className="gal-lightbox__arrow gal-lightbox__arrow--next" onClick={onNext} aria-label="Next image">
            <NextIcon />
          </button>
        )}
      </div>
    </div>
  );
}
