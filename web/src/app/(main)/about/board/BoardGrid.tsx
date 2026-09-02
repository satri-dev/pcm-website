"use client";

import { BoardCard } from "./BoardCard";

export interface BoardMember {
  id: string;
  photo: string;
  name: string;
  role: string;
  order: number;
}

export function BoardGrid({ members }: { members: BoardMember[] }) {
  if (members.length === 0) {
    return (
      <p style={{ padding: "2rem 0", color: "var(--muted)" }}>
        No board members found.
      </p>
    );
  }

  return (
    <div className="grid g-3" style={{ marginTop: "2rem" }}>
      {members.map((member, i) => (
        <BoardCard key={member.id || `member-${i}`} member={member} index={i} />
      ))}
    </div>
  );
}
