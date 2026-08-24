"use client";

import { useReveal } from "./use-reveal";

export function SectionHead({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  const reveal = useReveal<HTMLDivElement>();
  return (
    <div
      ref={reveal.ref}
      className={`section-head${center ? " center" : ""} ${reveal.revealClass}`}
      style={reveal.style}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-sub">{subtitle}</p>}
    </div>
  );
}
