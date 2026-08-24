"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "../legacy/use-reveal";

type StatItem = { count: number; suffix: string; label: string };

function Stat({ count, suffix, label }: StatItem) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setValue(count);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          const dur = 1600;
          let start: number | null = null;
          const step = (ts: number) => {
            if (start === null) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(count * eased);
            if (p < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [count]);

  return (
    <div className="stat" ref={ref}>
      <b>
        {Math.round(value).toLocaleString()}
        {suffix}
      </b>
      <span>{label}</span>
    </div>
  );
}

export function StatsGrid({ stats }: { stats: StatItem[] }) {
  const reveal = useReveal<HTMLDivElement>();
  return (
    <section className="stats section">
      <div className="wrap-wide">
        <div
          ref={reveal.ref}
          className={`section-head center ${reveal.revealClass}`}
          style={{ maxWidth: 560, marginInline: "auto", ...reveal.style }}
        >
          <span className="eyebrow on-dark">By the numbers</span>
          <h2 className="section-title" style={{ color: "#fff" }}>
            A legacy measured in outcomes
          </h2>
        </div>
        <div className="stats__grid mt-7">
          {stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
