"use client";

import { useEffect, useState } from "react";
import { BoardCard } from "./BoardCard";
import { boardMembers, type BoardMember } from "./data";

interface BoardApiItem {
  id: string;
  name: string;
  role: string;
  order?: number;
  photo?: string;
}

interface BoardResponse {
  items: BoardApiItem[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

export function BoardGrid() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch("/api/admin/people/board?page=1&pageSize=50");
        if (!res.ok) throw new Error("Failed to load board members");
        const data: BoardResponse = await res.json();
        if (!active) return;
        setMembers(
          data.items.map((item) => ({
            photo: item.photo || "",
            name: item.name,
            role: item.role,
          })),
        );
      } catch {
        if (!active) return;
        setError("Failed to load board members from the server.");
        setMembers(boardMembers);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <p style={{ padding: "2rem 0", color: "var(--muted)" }}>Loading board members…</p>
    );
  }

  if (members.length === 0) {
    return (
      <p style={{ padding: "2rem 0", color: "var(--muted)" }}>{error || "No board members found."}</p>
    );
  }

  return (
    <div className="grid g-3" style={{ marginTop: "2rem" }}>
      {members.map((member, i) => (
        <BoardCard key={member.name || `member-${i}`} member={member} index={i} />
      ))}
    </div>
  );
}