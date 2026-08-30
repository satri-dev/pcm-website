"use client";

import { useEffect, useMemo, useState } from "react";
import { useReveal } from "../legacy/use-reveal";
import type { Facility } from "./data";
import { facilities as fallbackFacilities } from "./data";

interface FacilityApiItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  image?: string;
  description: string;
  status: string;
  order?: number;
}

interface FacilityResponse {
  items: FacilityApiItem[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

function FacilityCard({ facility, index }: { facility: Facility; index: number }) {
  const reveal = useReveal<HTMLElement>(index * 60);
  return (
    <article ref={reveal.ref} className={`facility-card ${reveal.revealClass}`} style={reveal.style}>
      <div className="facility-card__media">
        <img src={facility.image || "/assets/img/about-2.jpg"} alt={facility.name} loading="lazy" />
      </div>
      <div className="facility-card__body">
        <span className="facility-card__icon">{facility.icon}</span>
        <span className="facility-card__cat">{facility.category}</span>
        <h3>{facility.name}</h3>
        <p>{facility.desc}</p>
      </div>
    </article>
  );
}

export function FacilitiesExplorer() {
  const [active, setActive] = useState("All");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch("/api/admin/campus/facilities?page=1&pageSize=100&status=published");
        if (!res.ok) throw new Error("Failed to load facilities");
        const data: FacilityResponse = await res.json();
        if (!active) return;
        setFacilities(
          data.items.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            icon: item.icon,
            image: item.image || "/assets/img/about-2.jpg",
            desc: item.description,
          })),
        );
      } catch {
        if (!active) return;
        setFacilities(fallbackFacilities);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(facilities.map((f) => f.category))],
    [facilities],
  );
  const visible = active === "All" ? facilities : facilities.filter((f) => f.category === active);

  if (loading) {
    return <p style={{ padding: "1rem 0", color: "var(--muted)" }}>Loading facilities…</p>;
  }

  if (facilities.length === 0) {
    return <p style={{ padding: "1rem 0", color: "var(--muted)" }}>No facilities found.</p>;
  }

  return (
    <>
      <div className="filter-chips" aria-label="Filter facilities by category">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`filter-chip${cat === active ? " is-active" : ""}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="facilities-grid mt-7">
        {visible.map((f, i) => (
          <FacilityCard key={f.id} facility={f} index={i} />
        ))}
      </div>
    </>
  );
}