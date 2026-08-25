"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useGallery } from "@/feature/gallery/hooks/useGallery";
import { albums } from "@/feature/gallery/data/gallery";
import FilterBar from "@/feature/gallery/components/FilterBar";
import AlbumGrid from "@/feature/gallery/components/AlbumGrid";
import PhotoGrid from "@/feature/gallery/components/PhotoGrid";
import Lightbox from "@/feature/gallery/components/Lightbox";
import type { GalleryCategory } from "@/feature/gallery/types";
import "./gallery.css";

/* ── SVG icons ── */
const VideoEmptyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="6" width="13" height="12" rx="2" />
    <path d="m15 10 7-4v12l-7-4" />
  </svg>
);
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function GalleryClient() {
  const rootRef = useRef<HTMLDivElement>(null);

  const {
    tab, setTab,
    category, changeCategory,
    filteredAlbums,
    openAlbumId, openAlbum, closeAlbum, albumPhotos,
    lightbox, openLightbox, closeLightbox, lightboxNext, lightboxPrev,
  } = useGallery();

  /* Reveal-on-scroll */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-inview"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-inview"); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [openAlbumId, tab]); // re-run when view changes so new items get observed

  /* Find album title for the open album */
  const openAlbum_ = albums.find((a) => a.id === openAlbumId);

  return (
    <div ref={rootRef} className="pcm-gallery">
      {/* ── Page Hero ── */}
      <section className="page-hero">
        <svg className="page-hero__peaks" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
        </svg>
        <div className="wrap-wide page-hero__inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            <span>Gallery</span>
          </nav>
          <h1>Campus Gallery</h1>
          <p>Glimpses of PCM — take a visual tour through campus life, events, student achievements and academic activities.</p>
        </div>
      </section>

      {/* ── Gallery Section ── */}
      <section className="section">
        <div className="wrap-wide">
          <div className="section-head center reveal">
            <span className="eyebrow">Glimpses of PCM</span>
            <h2 className="section-title">Explore our albums</h2>
            <p className="section-sub">Browse by category, open any album, then click a photo to view it full-size.</p>
          </div>

          {/* Photos / Videos tabs */}
          <div className="gal-tabs-list reveal" role="tablist" aria-label="Gallery type">
            <button
              className={`gal-tab-btn${tab === "photos" ? " active" : ""}`}
              role="tab"
              aria-selected={tab === "photos"}
              onClick={() => { setTab("photos"); closeAlbum(); }}
            >
              Photos
            </button>
            <button
              className={`gal-tab-btn${tab === "videos" ? " active" : ""}`}
              role="tab"
              aria-selected={tab === "videos"}
              onClick={() => { setTab("videos"); closeAlbum(); }}
            >
              Videos
            </button>
          </div>

          {/* Photos tab */}
          {tab === "photos" && (
            <>
              {/* Filter bar — only show when viewing album grid */}
              {!openAlbumId && (
                <FilterBar
                  active={category as GalleryCategory}
                  onChange={changeCategory}
                />
              )}

              {/* Album grid OR photo grid */}
              {openAlbumId ? (
                <PhotoGrid
                  photos={albumPhotos}
                  albumTitle={openAlbum_?.title ?? "Album"}
                  onBack={closeAlbum}
                  onPhotoClick={(photo) => openLightbox(photo, albumPhotos)}
                />
              ) : (
                <AlbumGrid albums={filteredAlbums} onOpen={openAlbum} />
              )}
            </>
          )}

          {/* Videos tab */}
          {tab === "videos" && (
            <div className="gal-empty reveal">
              <VideoEmptyIcon />
              <p>No video albums listed at this time — check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="cta-section">
        <div className="wrap-wide">
          <div className="cta-band reveal">
            <div className="cta-band__inner">
              <div>
                <span className="eyebrow" style={{ color: "var(--gold-400)" }}>Enter to Learn — Go Forth to Serve</span>
                <h2>Want to see it in person?</h2>
                <p>Book a campus visit and experience the PCM community for yourself.</p>
              </div>
              <div className="cta-band__actions">
                <Link className="gal-btn gal-btn-gold gal-btn-lg" href="/admission">
                  Apply Now <ArrowRight />
                </Link>
                <Link className="gal-btn gal-btn-ghost-dark gal-btn-lg" href="/about">
                  More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <Lightbox
        state={lightbox}
        onClose={closeLightbox}
        onNext={lightboxNext}
        onPrev={lightboxPrev}
      />
    </div>
  );
}
