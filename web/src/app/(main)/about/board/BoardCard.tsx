"use client";

import { useReveal } from "../legacy/use-reveal";
import { SocialLinks } from "../legacy/social-links";
import type { BoardMember } from "./data";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function BoardCard({ member, index }: { member: BoardMember; index: number }) {
  const reveal = useReveal<HTMLElement>(index * 50);
  return (
    <article ref={reveal.ref} className={`card bod-card ${reveal.revealClass}`} style={reveal.style}>
      <div className="bod-card__media">
        {member.photo ? (
          <img src={member.photo} alt={`${member.name} — ${member.role}`} loading="lazy" />
        ) : (
          <span className="bod-card__monogram">{initials(member.name)}</span>
        )}
      </div>
      <h3>{member.name}</h3>
      <span className="bod-card__role">{member.role}</span>
      <div className="bod-card__social">
        <SocialLinks />
      </div>
    </article>
  );
}
