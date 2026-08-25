"use client";

import type { GalleryCategory } from "../types";
import { CATEGORIES, CATEGORY_LABELS } from "../data/gallery";

interface Props {
  active: GalleryCategory;
  onChange: (cat: GalleryCategory) => void;
}

export default function FilterBar({ active, onChange }: Props) {
  return (
    <div className="gal-filters" role="toolbar" aria-label="Filter gallery by category">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`gal-filter-btn${active === cat ? " active" : ""}`}
          onClick={() => onChange(cat as GalleryCategory)}
          aria-pressed={active === cat}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
}
