import Link from "next/link";
import { ArrowRight } from "lucide-react";

const reasons = [
  { icon: "🎓", title: "PU-affiliated degrees", desc: "All three programs are awarded by Pokhara University — a nationally recognised qualification employers trust." },
  { icon: "💰", title: "Scholarships for all", desc: "Merit and need-based awards with up to 100% coverage, because quality education should stay affordable." },
  { icon: "👩‍🏫", title: "Mentors who know you", desc: "Small batches and an open-door culture mean faculty know your goals — and push you toward them." },
  { icon: "💼", title: "Careers & placements", desc: "Internships, field visits and a dedicated placement team connect classroom learning to real jobs." },
  { icon: "🎉", title: "A campus that comes alive", desc: "Fests, sports, clubs and community drives build confidence and a network that lasts a lifetime." },
  { icon: "📍", title: "Central, safe location", desc: "On Gyan Marg in Nadipur, Pokhara-2 — easy to reach, hard to leave, and close to everything you need." },
];

export default function WhyChoosePCM() {
  return (
    <section className="py-[clamp(3.5rem,8vw,6.5rem)]">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-11">
          <div className="max-w-[640px]">
            <span className="font-mono text-[0.74rem] tracking-[0.2em] uppercase text-pcm-blue">The PCM difference</span>
            <h2 className="mt-2 text-[clamp(1.8rem,3.4vw,2.6rem)] font-display font-semibold text-pcm-navy">Why choose PCM?</h2>
            <p className="mt-2 text-muted-foreground">Twenty-three years of affordable, quality education — here is what sets us apart.</p>
          </div>
          <Link href="/about" className="inline-flex items-center gap-1 font-bold text-pcm-blue hover:gap-2 transition-all">
            About PCM <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) => (
            <article key={r.title} className="flex gap-4 items-start bg-card border border-border rounded-2xl p-6 shadow-pcm-sm hover:-translate-y-1 hover:border-pcm-blue hover:shadow-pcm-md transition-all">
              <span className="shrink-0 w-12 h-12 grid place-items-center rounded-xl bg-gradient-to-br from-pcm-blue to-pcm-blue-900 text-white text-[1.45rem] shadow-sm">
                {r.icon}
              </span>
              <div>
                <h3 className="font-semibold text-pcm-navy mb-1">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
