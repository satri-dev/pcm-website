"use client";

import { useEffect, useState } from "react";
import { LeaderCard } from "./LeaderCard";
import { leaders as fallbackLeaders, type Leader } from "./data";

interface MessageApiItem {
  id: string;
  title: string;
  author: string;
  role: string;
  excerpt: string;
}

interface MessageResponse {
  items: MessageApiItem[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

function toLeader(item: MessageApiItem): Leader {
  return {
    photo: "",
    chip: initials(item.author),
    eyebrow: item.title,
    name: item.author,
    role: item.role,
    text: item.excerpt,
  };
}

export function LeaderList() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch("/api/admin/people/messages?page=1&pageSize=100");
        if (!res.ok) throw new Error("Failed to load messages");
        const data: MessageResponse = await res.json();
        if (!active) return;
        setLeaders(data.items.map(toLeader));
      } catch {
        if (!active) return;
        setLeaders(fallbackLeaders);
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
    return <p style={{ padding: "2rem 0", color: "var(--muted)" }}>Loading messages…</p>;
  }

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