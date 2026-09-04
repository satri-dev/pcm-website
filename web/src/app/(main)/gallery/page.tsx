import type { Metadata } from "next";
import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import GalleryClient from "./GalleryClient";
import { listGallery } from "@/repositories/gallery.repository";
import { getGalleryPageSettings } from "@/repositories/gallery-settings.repository";
import { adaptPaginatedAlbums, adaptPaginatedVideos } from "@/feature/gallery/lib/adapt";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const metadata: Metadata = {
  title: "Campus Gallery | Pokhara College of Management",
  description:
    "Explore the campus gallery of Pokhara College of Management — annual fests, sports, tours, seminars and everyday student life at PCM in Pokhara.",
  keywords: [
    "PCM gallery",
    "Pokhara College of Management photos",
    "PCM campus life",
    "PCM events",
    "PCM Pokhara",
  ],
  openGraph: {
    title: "Campus Gallery | Pokhara College of Management",
    description:
      "Explore the campus gallery of Pokhara College of Management — annual fests, sports, tours, seminars and everyday student life at PCM in Pokhara.",
    url: "https://www.pcm.edu.np/gallery",
    images: [
      {
        url: "/assets/img/about-2.jpg",
        width: 1200,
        height: 630,
        alt: "PCM campus gallery",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campus Gallery | Pokhara College of Management",
    description: "Explore the campus gallery of Pokhara College of Management.",
    images: ["/assets/img/about-2.jpg"],
  },
  alternates: {
    canonical: "https://www.pcm.edu.np/gallery",
  },
};

interface GalleryPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ALBUM_PAGE_SIZE = 9;
const VIDEO_PAGE_SIZE = 9;

async function GalleryContent({ searchParams }: GalleryPageProps) {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.galleryList);

  const params = await searchParams;
  const albumPage = Math.max(1, Number(params?.albumPage) || 1);
  const videoPage = Math.max(1, Number(params?.videoPage) || 1);

  // Two separate DB-level paginated queries — MongoDB skip/limit
  const [albumResult, videoResult, settings] = await Promise.all([
    listGallery({
      type: "photo",
      page: albumPage,
      pageSize: ALBUM_PAGE_SIZE,
    }),
    listGallery({
      type: "video",
      page: videoPage,
      pageSize: VIDEO_PAGE_SIZE,
    }),
    getGalleryPageSettings(),
  ]);

  const { albums, photos: allPhotos } = adaptPaginatedAlbums(
    albumResult.items,
    albumResult
  );
  const videos = adaptPaginatedVideos(videoResult.items, videoResult);

  return (
    <GalleryClient
      albums={albums}
      allPhotos={allPhotos}
      videos={videos}
      settings={settings}
    />
  );
}

function GalleryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage({ searchParams }: GalleryPageProps) {
  return (
    <Suspense fallback={<GalleryLoading />}>
      <GalleryContent searchParams={searchParams} />
    </Suspense>
  );
}
