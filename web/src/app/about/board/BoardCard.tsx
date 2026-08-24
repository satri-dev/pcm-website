"use client";

import { useReveal } from "../legacy/use-reveal";
import { SocialLinks } from "../legacy/social-links";
import type { BoardMember } from "./data";

export function BoardCard({ member, index }: { member: BoardMember; index: number }) {
  const reveal = useReveal<HTMLElement>(index * 50);
  return (
    <article ref={reveal.ref} className={`card bod-card ${reveal.revealClass}`} style={reveal.style}>
      <div className="bod-card__media">
        <img src={member.photo} alt={`${member.name} — ${member.role}`} loading="lazy" />
      </div>
      <h3>{member.name}</h3>
      <span className="bod-card__role">{member.role}</span>
      <div className="bod-card__social">
        <SocialLinks />
      </div>
    </article>
  );
}
