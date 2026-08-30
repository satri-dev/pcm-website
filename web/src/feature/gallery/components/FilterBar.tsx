"use client";

import type { GalleryCategoryOption } from "../data/gallery";

interface Props {
  categories: GalleryCategoryOption[];
  active: string;
  onChange: (cat: string) => void;
}

export default function FilterBar({ categories, active, onChange }: Props) {
  return (
    <div className="gal-filters" role="toolbar" aria-label="Filter gallery by category">
      {categories.map((cat) => (
        <button
          key={cat.value}
          className={`gal-filter-btn${active === cat.value ? " active" : ""}`}
          onClick={() => onChange(cat.value)}
          aria-pressed={active === cat.value}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
