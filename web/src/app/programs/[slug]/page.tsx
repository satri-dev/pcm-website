import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { programs, getProgramBySlug } from "@/data/programs";
import { buttonVariants } from "@/components/ui/button";

// Pre-render /programs/bba, /programs/bba-finance, /programs/bcsit at build time
export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const program = getProgramBySlug(slug);
    if (!program) return {};
    return {
      title: `${program.title} | Pokhara College of Management`,
      description: program.summary,
    };
  });
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) notFound();

  return (
    <>
      <section className="relative bg-pcm-navy text-white/85 overflow-hidden">
        <Image 
          src={program.heroImage} 
          alt="" 
          fill 
          priority
          sizes="100vw"
          className="object-cover opacity-40" 
        />
        <div className="relative z-10 container py-[clamp(3rem,6vw,4.5rem)]">
          <nav className="font-mono text-[0.74rem] uppercase tracking-wide text-white/55 mb-3">
            <Link href="/programs" className="text-pcm-green hover:underline">Programs</Link>
            <span className="mx-2">/</span>
            <span className="text-white/85">{program.badge}</span>
          </nav>
          <h1 className="text-white font-display font-semibold text-[clamp(2rem,4vw,3rem)] max-w-[24ch]">
            {program.title}
          </h1>
          <p className="mt-3 max-w-[56ch] text-white/70">{program.summary}</p>
        </div>
      </section>

      <section className="py-[clamp(3rem,6vw,5rem)]">
        <div className="container grid lg:grid-cols-[1fr_320px] gap-10">
          <article className="prose grid gap-5 max-w-none">
            <h2 className="text-[1.6rem] font-display font-semibold text-pcm-navy">Program Overview</h2>
            <p className="text-muted-foreground max-w-[72ch]">{program.overview}</p>

            <h3 className="text-[1.25rem] font-display font-semibold text-pcm-navy mt-2">Highlights</h3>
            <ul className="grid gap-2">
              {program.highlights.map((h) => (
                <li key={h} className="flex gap-2 items-start text-muted-foreground">
                  <Check className="w-4 h-4 text-pcm-green mt-1 shrink-0" /> {h}
                </li>
              ))}
            </ul>
          </article>

          <aside className="sticky top-24 h-fit grid gap-4 p-7 bg-card border border-border rounded-2xl shadow-pcm-sm">
            <h3 className="text-[1.25rem] font-display font-semibold text-pcm-navy">Program details</h3>
            <div className="grid gap-1 text-sm">
              {[
                ["Duration", program.duration],
                ["Credit Hours", program.creditHours],
                ["Seats", program.seats],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border py-2 last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <b className="text-pcm-navy">{v}</b>
                </div>
              ))}
            </div>
            <Link href="/admission" className={buttonVariants({ variant: "primary" })}>
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
