"use client";

import { useReveal } from "../legacy/use-reveal";
import { SocialLinks } from "../legacy/social-links";
import type { Person } from "./data";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function FacultyCard({ person, index }: { person: Person; index: number }) {
  const reveal = useReveal<HTMLDivElement>(index * 60);
  return (
    <div ref={reveal.ref} className={`fac-card ${reveal.revealClass}`} style={reveal.style}>
      <div className="fac-card__photo">
        {person.photo ? (
          <img src={person.photo} alt={person.name} loading="lazy" />
        ) : (
          <span className="fac-card__monogram">{initials(person.name)}</span>
        )}
      </div>
      <h3>{person.name}</h3>
      <span>{person.role}</span>
      <div className="fac-card__social">
        <SocialLinks />
      </div>
    </div>
  );
}
