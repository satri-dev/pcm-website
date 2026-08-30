import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Gallery } from "@/types/gallery";

export default function GallerySection({ galleries }: { galleries: Gallery[] }) {
  const galleryImages = galleries.slice(0, 5).map((g) => ({
    src: g.image || g.photos?.[0]?.url || "/images/hero-4.jpg",
    alt: g.title,
    title: g.title,
  }));
  return (
    <section className="py-[clamp(4rem,8vw,6rem)] bg-secondary/30">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 rounded-full bg-pcm-blue/10 text-pcm-blue text-sm font-mono uppercase tracking-wider mb-4">
              Glimpses of PCM
            </span>
            <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-display font-semibold text-pcm-navy mb-4">
              Moments from our campus
            </h2>
            <p className="text-muted-foreground text-lg">
              A quick look at life, learning and celebration at PCM.
            </p>
          </div>
          <Link 
            href="/gallery" 
            className="inline-flex items-center gap-2 text-pcm-blue hover:text-pcm-blue-700 font-semibold transition-colors group"
          >
            Full gallery 
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {galleryImages.map((image, index) => (
            <Link
              key={image.title}
              href="/gallery"
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-pcm-sm hover:shadow-pcm-md transition-all hover:-translate-y-1"
              style={{
                animationDelay: `${index * 60}ms`
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}