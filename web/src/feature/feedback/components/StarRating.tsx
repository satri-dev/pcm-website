"use client";

interface Props {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}

export default function StarRating({ value, onChange, max = 5 }: Props) {
  return (
    <div className="fb-stars" role="group" aria-label="Star rating">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          className={`fb-star${value >= star ? " fb-star--filled" : ""}`}
          onClick={() => onChange(star)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          aria-pressed={value >= star}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
