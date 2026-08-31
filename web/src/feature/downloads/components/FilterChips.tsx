"use client";

interface Props {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
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
