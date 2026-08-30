"use client";

import type { DownloadCategory } from "../types";

interface Props {
  categories: DownloadCategory[];
  active: DownloadCategory;
  onChange: (cat: DownloadCategory) => void;
}

export default function FilterChips({ categories, active, onChange }: Props) {
  return (
    <div
      className="dl-filter-chips"
      role="toolbar"
      aria-label="Filter downloads by category"
    >
      {categories.map((cat) => (
        <button
          key={cat}
          className={`dl-chip${active === cat ? " active" : ""}`}
          onClick={() => onChange(cat)}
          aria-pressed={active === cat}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
