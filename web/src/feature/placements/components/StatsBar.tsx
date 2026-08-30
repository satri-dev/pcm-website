import type { PlacementStat } from "../types";

interface Props {
  stats: PlacementStat[];
}

export default function StatsBar({ stats }: Props) {
  return (
    <div className="pl-stats-bar">
      <div className="pl-stats-bar__inner">
        {stats.map((stat) => (
          <div key={stat.id} className="pl-stats-bar__item">
            <span className="pl-stats-bar__value">{stat.value}</span>
            <span className="pl-stats-bar__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
