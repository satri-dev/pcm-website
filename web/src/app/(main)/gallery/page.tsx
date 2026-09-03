import type { Metadata } from "next";
import { Suspense } from "react";
import { cacheLife } from "next/cache";
import GalleryClient from "./GalleryClient";
import { listGallery } from "@/repositories/gallery.repository";
import { getGalleryPageSettings } from "@/repositories/gallery-settings.repository";
import { adaptGalleryItems } from "@/feature/gallery/lib/adapt";

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

async function GalleryContent() {
  "use cache";
  cacheLife("content");

  const [{ items }, settings] = await Promise.all([
    listGallery({ pageSize: 100 }),
    getGalleryPageSettings(),
  ]);

  const { albums, photos, videos } = adaptGalleryItems(items);

  return <GalleryClient albums={albums} photos={photos} videos={videos} settings={settings} />;
}

function GalleryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<GalleryLoading />}>
      <GalleryContent />
    </Suspense>
  );
}
