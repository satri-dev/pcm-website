import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Program as ProgramType } from "@/types/programs";

export default function ProgramsSection({ programs }: { programs: ProgramType[] }) {
  return (
    <section className="py-[clamp(3.5rem,8vw,6.5rem)] bg-secondary/40 border-y border-border">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-11">
          <div className="max-w-[640px]">
            <span className="font-mono text-[0.74rem] tracking-[0.2em] uppercase text-pcm-blue">Programs</span>
            <h2 className="mt-2 text-[clamp(1.8rem,3.4vw,2.6rem)] font-display font-semibold text-pcm-navy">
              Three paths to a strong career
            </h2>
            <p className="mt-2 text-muted-foreground">
              Every PCM program blends conceptual depth with real-world practice, non-credit skill courses and internship experience.
            </p>
          </div>
          <Link href="/programs" className="inline-flex items-center gap-1 font-bold text-pcm-blue hover:gap-2 transition-all">
            All programs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {programs.map((p) => (
            <article key={p.slug} className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-pcm-sm hover:-translate-y-1.5 hover:shadow-pcm-lg transition-all">
              <div className="relative aspect-[16/10] bg-secondary">
                <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-pcm-green text-pcm-navy font-mono text-[0.68rem] font-bold tracking-[0.1em] uppercase">
                  {p.code}
                </span>
                {p.image && (
                  <Image src={p.image} alt={p.name} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                )}
              </div>
              <div className="p-6 flex-1 grid gap-2 content-start">
                <h3 className="text-[1.32rem] font-display font-semibold text-pcm-navy">
                  <Link href={`/programs/${p.slug}`}>{p.name}</Link>
                </h3>
                <div className="text-sm text-muted-foreground prose prose-sm max-w-none prose-p:my-0" dangerouslySetInnerHTML={{ __html: p.intro }} />
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 pt-3 border-t border-dashed border-border">
                  <div>
                    <b className="block text-pcm-blue leading-none">{p.duration}</b>
                    <span className="text-[0.74rem] text-muted-foreground font-medium">Duration</span>
                  </div>
                  <div>
                    <b className="block text-pcm-blue leading-none">{p.seats}</b>
                    <span className="text-[0.74rem] text-muted-foreground font-medium">Seats</span>
                  </div>
                </div>
                <Link href={`/programs/${p.slug}`} className="inline-flex items-center gap-1 mt-2 font-bold text-sm text-pcm-blue hover:gap-2 transition-all">
                  Explore {p.code} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
