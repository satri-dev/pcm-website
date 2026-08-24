"use client";

import { useReveal } from "./use-reveal";
import { ArrowRightIcon } from "./icons";

export function CtaBand({
  title,
  text,
  primary,
  secondary,
}: {
  title: string;
  text: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}) {
  const reveal = useReveal<HTMLDivElement>();
  return (
    <section className="cta-section">
      <div className="wrap-wide">
        <div className={`cta-band ${reveal.revealClass}`} ref={reveal.ref} style={reveal.style}>
          <div className="cta-band__inner">
            <div>
              <span className="eyebrow on-dark">Enter to Learn — Go Forth to Serve</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
            <div className="cta-band__actions">
              <a className="btn btn-gold btn-lg" href={primary.href}>
                {primary.label} <ArrowRightIcon />
              </a>
              <a className="btn btn-ghost on-dark btn-lg" href={secondary.href}>
                {secondary.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
