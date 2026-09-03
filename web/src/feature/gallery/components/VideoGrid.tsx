"use client";

import type { GalleryVideo } from "../types";
import VideoCard from "./VideoCard";

interface Props {
  videos: GalleryVideo[];
  onPlay: (video: GalleryVideo) => void;
  activeVideo?: GalleryVideo | null;
}

const VideoEmptyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="6" width="13" height="12" rx="2" />
    <path d="m15 10 7-4v12l-7-4" />
  </svg>
);

export default function VideoGrid({ videos, onPlay, activeVideo }: Props) {
  const activeId = activeVideo?.id;

  if (videos.length === 0) {
    return (
      <div className="gal-empty">
        <VideoEmptyIcon />
        <p>No videos in this category yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="gal-video-grid">
      {videos.map((video, i) => (
        <div key={video.id} className="reveal" style={{ transitionDelay: `${i * 60}ms` }}>
          <VideoCard
            video={video}
            active={video.id === activeId}
            onClick={() => onPlay(video)}
          />
        </div>
      ))}
    </div>
  );
}
