"use client";

import { useState } from "react";
import { useReveal } from "../legacy/use-reveal";
import type { Facility } from "./data";

function FacilityCard({ facility, index }: { facility: Facility; index: number }) {
  const reveal = useReveal<HTMLElement>(index * 60);
  return (
    <article ref={reveal.ref} className={`facility-card ${reveal.revealClass}`} style={reveal.style}>
      <div className="facility-card__media">
        <img src={facility.image} alt={facility.name} loading="lazy" />
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

export function FacilitiesExplorer({ facilities }: { facilities: Facility[] }) {
  const [active, setActive] = useState("All");
  const categories = ["All", ...new Set(facilities.map((f) => f.category))];
  const visible = active === "All" ? facilities : facilities.filter((f) => f.category === active);

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
