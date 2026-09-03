"use client";

import { LeaderCard, type Leader } from "./LeaderCard";

export function LeaderList({ leaders }: { leaders: Leader[] }) {
  if (leaders.length === 0) {
    return <p style={{ padding: "2rem 0", color: "var(--muted)" }}>No leadership messages found.</p>;
  }

  return (
    <div className="leader-stack">
      {leaders.map((leader, i) => (
        <LeaderCard key={leader.name || `leader-${i}`} leader={leader} index={i} />
      ))}
    </div>
  );
}
