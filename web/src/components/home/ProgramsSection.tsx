import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const programs = [
  {
    badge: "BBA",
    title: "Bachelor in Business Administration",
    href: "/program-bba",
    image: "/images/program-bba.jpg",
    desc: "Designed to produce professional managers, giving students sound conceptual foundations alongside the practical skills to lead in a dynamic business world.",
    meta: [["4 Years", "Duration"], ["120 Cr", "Credit Hours"], ["48", "Seats"]],
  },
  {
    badge: "BBA-Finance",
    title: "Business Administration in Finance",
    href: "/program-bba-finance",
    image: "/images/program-bbaf.jpg",
    desc: "A finance-focused BBA that builds deep expertise in financial analysis, investment and corporate finance for careers in banking and beyond.",
    meta: [["4 Years", "Duration"], ["120 Cr", "Credit Hours"], ["48", "Seats"]],
  },
  {
    badge: "BCSIT",
    title: "Computer System & Information Technology",
    href: "/program-bcsit",
    image: "/images/program-bcsit.jpg",
    desc: "A four-year, eight-semester degree merging information technology with business management to meet the evolving demands of modern organisations.",
    meta: [["4 Years", "Duration"], ["127 Cr", "Credit Hours"], ["48", "Seats"]],
  },
];

export default function ProgramsSection() {
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
            <article key={p.badge} className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-pcm-sm hover:-translate-y-1.5 hover:shadow-pcm-lg transition-all">
              <div className="relative aspect-[16/10] bg-secondary">
                <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-pcm-green text-pcm-navy font-mono text-[0.68rem] font-bold tracking-[0.1em] uppercase">
                  {p.badge}
                </span>
                <Image src={p.image} alt={p.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-6 flex-1 grid gap-2 content-start">
                <h3 className="text-[1.32rem] font-display font-semibold text-pcm-navy">
                  <Link href={p.href}>{p.title}</Link>
                </h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 pt-3 border-t border-dashed border-border">
                  {p.meta.map(([value, label]) => (
                    <div key={label}>
                      <b className="block text-pcm-blue leading-none">{value}</b>
                      <span className="text-[0.74rem] text-muted-foreground font-medium">{label}</span>
                    </div>
                  ))}
                </div>
                <Link href={p.href} className="inline-flex items-center gap-1 mt-2 font-bold text-sm text-pcm-blue hover:gap-2 transition-all">
                  Explore {p.badge} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
