import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { WhyChooseReason } from "@/types/homepage";

export default function WhyChoosePCM({ reasons }: { reasons: WhyChooseReason[] }) {
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
