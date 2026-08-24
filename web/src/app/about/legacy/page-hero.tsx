"use client";

import { ChevronRightIcon } from "./icons";

export function PageHero({
  crumbs,
  title,
  subtitle,
}: {
  crumbs: { label: string; href?: string }[];
  title: string;
  subtitle: string;
}) {
  return (
    <section className="page-hero">
      <svg
        className="page-hero__peaks"
        viewBox="0 0 1440 400"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
        <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
      </svg>
      <div className="wrap-wide page-hero__inner">
        <nav className="crumbs" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={i}>
              {c.href ? <a href={c.href}>{c.label}</a> : <span>{c.label}</span>}
              {i < crumbs.length - 1 && <ChevronRightIcon />}
            </span>
          ))}
        </nav>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
