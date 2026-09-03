"use client";

import type { GalleryVideo } from "../types";

interface Props {
  video: GalleryVideo;
  active?: boolean;
  onClick: () => void;
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default function VideoCard({ video, active = false, onClick }: Props) {
  /* iframe stays mounted so YouTube preloads; playback starts only when active */
  const src = video.youtubeId
    ? `https://www.youtube-nocookie.com/embed/${video.youtubeId}${active ? "?autoplay=1" : ""}`
    : "";

  return (
    <div
      className={`gal-video-item${active ? " active" : ""}`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      role="button"
      tabIndex={0}
      aria-label={`Play video: ${video.title}`}
      aria-pressed={active}
    >
      <div className="gal-video-item__media">
        {src ? (
          <iframe
            className={`gal-video-item__frame${active ? "" : " gal-video-item__frame--idle"}`}
            src={src}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="eager"
          />
        ) : null}
        {!active && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="gal-video-item__thumb"
              src={video.thumbnailSrc}
              alt={video.thumbnailAlt}
              loading="lazy"
            />
            <span className="gal-video-item__play" aria-hidden="true">
              <PlayIcon />
            </span>
          </>
        )}
      </div>
      <div className="gal-video-item__overlay">
        <span className="gal-video-item__tag">
          {video.category.charAt(0).toUpperCase() + video.category.slice(1)}
        </span>
        <b className="gal-video-item__title">{video.title}</b>
      </div>
    </div>
  );
}
