"use client";

import { useReveal } from "../legacy/use-reveal";
import { SocialLinks } from "../legacy/social-links";
import type { Person } from "./data";

export function FacultyCard({ person, index }: { person: Person; index: number }) {
  const reveal = useReveal<HTMLDivElement>(index * 60);
  return (
    <div ref={reveal.ref} className={`fac-card ${reveal.revealClass}`} style={reveal.style}>
      <div className="fac-card__photo">
        <img src={person.photo} alt={person.name} loading="lazy" />
      </div>
      <h3>{person.name}</h3>
      <span>{person.role}</span>
      <div className="fac-card__social">
        <SocialLinks />
      </div>
    </div>
  );
}
