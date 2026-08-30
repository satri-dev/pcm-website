"use client";

import { useEffect, useState } from "react";
import { SectionHead } from "../legacy/section-head";
import { FacultyCard } from "./FacultyCard";
import { team as fallbackTeam, type Person } from "./data";

interface FacultyApiItem {
  id: string;
  name: string;
  role: string;
  group: string;
  photo?: string;
  email?: string;
  phone?: string;
}

interface FacultyResponse {
  items: FacultyApiItem[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

function toPerson(item: FacultyApiItem): Person {
  return { photo: item.photo || "", name: item.name, role: item.role };
}

export function FacultyGrid() {
  const [leadership, setLeadership] = useState<Person[]>([]);
  const [team, setTeam] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch("/api/admin/people/faculty?page=1&pageSize=100");
        if (!res.ok) throw new Error("Failed to load faculty");
        const data: FacultyResponse = await res.json();
        if (!active) return;
        const leaders = data.items.filter((item) => item.group === "Leadership");
        const others = data.items.filter((item) => item.group !== "Leadership");
        setLeadership(leaders.map(toPerson));
        setTeam(others.map(toPerson));
      } catch {
        if (!active) return;
        setLeadership([]);
        setTeam(fallbackTeam);
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
      <p style={{ padding: "2rem 0", color: "var(--muted)" }}>Loading faculty…</p>
    );
  }

  return (
    <>
      <section className="section">
        <div className="wrap-wide">
          <SectionHead eyebrow="Leadership" title="Guiding PCM" />
          {leadership.length === 0 ? (
            <p style={{ padding: "1rem 0", color: "var(--muted)" }}>No leadership members found.</p>
          ) : (
            <div className="grid g-4" style={{ marginTop: "2rem" }}>
              {leadership.map((person, i) => (
                <FacultyCard key={person.name || `leader-${i}`} person={person} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="section tone-sky">
        <div className="wrap-wide">
          <SectionHead eyebrow="Our team" title="Faculty & administration" />
          {team.length === 0 ? (
            <p style={{ padding: "1rem 0", color: "var(--muted)" }}>No faculty members found.</p>
          ) : (
            <div className="grid g-4" style={{ marginTop: "2rem" }}>
              {team.map((person, i) => (
                <FacultyCard key={person.name || `member-${i}`} person={person} index={i % 4} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}