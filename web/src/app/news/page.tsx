import Link from "next/link";
import Image from "next/image";
import { newsData } from "@/data/news";

export const metadata = { title: "News | Pokhara College of Management" };

export default function NewsPage() {
  return (
    <section className="py-[clamp(3rem,6vw,5rem)]">
      <div className="container">
        <h1 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-display font-semibold text-pcm-navy mb-8">
          Latest from PCM
        </h1>
        <div className="grid gap-6 lg:grid-cols-3">
          {newsData.map((n) => (
            <Link
              key={n.slug}
              href={`/news/${n.slug}`}
              className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-pcm-sm hover:-translate-y-1.5 hover:shadow-pcm-lg transition-all"
            >
              <div className="relative aspect-[16/10] bg-secondary">
                <Image 
                  src={n.image} 
                  alt={n.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={newsData.indexOf(n) < 3}
                  className="object-cover" 
                />
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-md bg-pcm-dark/85 text-white font-mono text-xs">
                  {n.date}
                </span>
              </div>
              <div className="p-6 grid gap-2">
                <span className="inline-block w-fit px-3 py-1 rounded-full bg-secondary border border-border text-pcm-blue font-mono text-[0.66rem] uppercase tracking-wide">
                  {n.tag}
                </span>
                <h2 className="text-[1.15rem] font-display font-semibold text-pcm-navy">{n.title}</h2>
                <p className="text-sm text-muted-foreground">{n.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
