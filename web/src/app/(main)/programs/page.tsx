import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { programs } from "@/data/programs";

export const metadata = { title: "Programs | Pokhara College of Management" };

export default function ProgramsPage() {
  return (
    <section className="py-[clamp(3rem,6vw,5rem)]">
      <div className="container">
        <h1 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-display font-semibold text-pcm-navy mb-8">
          All Programs
        </h1>
        <div className="grid gap-6 lg:grid-cols-3">
          {programs.map((p) => (
            <Link
              key={p.slug}
              href={`/programs/${p.slug}`}
              className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-pcm-sm hover:-translate-y-1.5 hover:shadow-pcm-lg transition-all"
            >
              <div className="relative aspect-[16/10] bg-secondary">
                <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-pcm-green text-pcm-navy font-mono text-[0.68rem] font-bold uppercase">
                  {p.badge}
                </span>
                <Image 
                  src={p.image} 
                  alt={p.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover" 
                />
              </div>
              <div className="p-6 grid gap-2">
                <h2 className="text-[1.2rem] font-display font-semibold text-pcm-navy">{p.title}</h2>
                <p className="text-sm text-muted-foreground">{p.summary}</p>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-pcm-blue group-hover:gap-2 transition-all">
                  Explore {p.badge} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
