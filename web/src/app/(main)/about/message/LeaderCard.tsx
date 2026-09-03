"use client";

import { useReveal } from "../legacy/use-reveal";
import { SocialLinks } from "../legacy/social-links";

export interface Leader {
  photo: string;
  chip: string;
  eyebrow: string;
  name: string;
  role: string;
  text: string;
}

export function LeaderCard({ leader, index }: { leader: Leader; index: number }) {
  const reveal = useReveal<HTMLElement>(index * 60);
  return (
    <article ref={reveal.ref} className={`leader-card ${reveal.revealClass}`} style={reveal.style}>
      <div className="leader-card__media">
        {leader.photo ? (
          <img src={leader.photo} alt={leader.name} loading="lazy" />
        ) : (
          <span className="leader-card__monogram">{leader.chip}</span>
        )}
        <span className="leader-card__chip">{leader.chip}</span>
      </div>
      <div className="leader-card__body">
        <span className="eyebrow">{leader.eyebrow}</span>
        <h3 className="leader-card__name">{leader.name}</h3>
        <div className="leader-card__role">{leader.role}</div>
        <p className="leader-card__text">{leader.text}</p>
        <div className="leader-card__social">
          <SocialLinks />
        </div>
      </div>
    </article>
  );
}
