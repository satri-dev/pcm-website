import type { HeroStat } from "@/data/hero-slides";

export default function StatsOverlay({ stats }: { stats: HeroStat[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-[clamp(1.5rem,4vw,3.5rem)] mt-6 sm:mt-9">
      {stats.map((s) => (
        <div key={s.label} className="grid gap-0.5 sm:gap-1">
          <b className="font-display text-xl sm:text-2xl lg:text-[1.7rem] text-white">{s.value}</b>
          <span className="text-[0.65rem] sm:text-xs lg:text-[0.82rem] text-white/62">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
