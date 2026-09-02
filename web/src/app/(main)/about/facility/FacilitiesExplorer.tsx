"use client";

import { useMemo, useState } from "react";
import { useReveal } from "../legacy/use-reveal";

export interface FacilityItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  image: string;
  description: string;
}

function FacilityCard({
  facility,
  index,
}: {
  facility: FacilityItem;
  index: number;
}) {
  const reveal = useReveal<HTMLElement>(index * 60);
  return (
    <article
      ref={reveal.ref}
      className={`facility-card ${reveal.revealClass}`}
      style={reveal.style}
    >
      <div className="facility-card__media">
        <img src={facility.image} alt={facility.name} loading="lazy" />
      </div>
      <div className="facility-card__body">
        <span className="facility-card__icon">{facility.icon}</span>
        <span className="facility-card__cat">{facility.category}</span>
        <h3>{facility.name}</h3>
        <div
          className="prose prose-sm max-w-none facility-card__prose"
          dangerouslySetInnerHTML={{ __html: facility.description }}
        />
      </div>
    </article>
  );
}

export function FacilitiesExplorer({
  facilities,
}: {
  facilities: FacilityItem[];
}) {
  const [active, setActive] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(facilities.map((f) => f.category))],
    [facilities],
  );
  const visible =
    active === "All"
      ? facilities
      : facilities.filter((f) => f.category === active);

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
