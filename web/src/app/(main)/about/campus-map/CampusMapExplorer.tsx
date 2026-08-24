"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "../legacy/use-reveal";
import { categoryColors, landmarks, type Landmark } from "./data";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function CampusMapExplorer() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [stageSize, setStageSize] = useState({ w: 0, h: 0 });
  const stageRef = useRef<HTMLDivElement | null>(null);
  const markerRefs = useRef(new Map<string, HTMLButtonElement>());
  const reveal = useReveal<HTMLDivElement>();

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setStageSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const active = landmarks.find((l) => l.id === activeId) ?? null;

  const select = (lm: Landmark, scroll = false) => {
    setActiveId(lm.id);
    if (scroll) {
      markerRefs.current.get(lm.id)?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  };

  const popupStyle =
    active && stageSize.w
      ? {
          left: clamp((active.x / 100) * stageSize.w, 70, Math.max(70, stageSize.w - 70)),
          top: Math.max(12, (active.y / 100) * stageSize.h - 96),
        }
      : undefined;

  const categories = [...new Set(landmarks.map((l) => l.category))];

  return (
    <div ref={reveal.ref} className={`campus-map-wrap ${reveal.revealClass}`} style={reveal.style} id="campus-map">
      <div className="campus-map__stage" ref={stageRef}>
        <svg className="campus-map__bg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="1000" height="600" fill="#EAF0FB" />
          <path d="M0 470 L120 430 L260 470 L400 415 L560 475 L740 420 L900 470 L1000 440 L1000 600 L0 600Z" fill="#CDD9EE" />
          <rect x="70" y="90" width="220" height="300" rx="10" fill="#C3D0EC" />
          <rect x="340" y="60" width="260" height="180" rx="10" fill="#B7C6E8" />
          <rect x="360" y="270" width="220" height="140" rx="10" fill="#B7C6E8" />
          <rect x="640" y="80" width="260" height="200" rx="10" fill="#C3D0EC" />
          <rect x="660" y="310" width="180" height="120" rx="10" fill="#CDD9EE" />
          <circle cx="130" cy="450" r="46" fill="#AED5A6" />
          <circle cx="500" cy="450" r="60" fill="#AED5A6" />
          <circle cx="820" cy="455" r="42" fill="#AED5A6" />
          <path d="M0 30 L300 70 L520 20 L760 80 L1000 40" fill="none" stroke="#9FB2D8" strokeWidth="2" />
          <path d="M70 470 L400 470 L560 470 L900 470" stroke="#fff" strokeWidth="14" strokeLinecap="round" />
          <path d="M70 470 L560 210" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeDasharray="2 14" />
          <text x="180" y="250" fontFamily="Poppins, sans-serif" fontSize="20" fill="#7A8CB8" transform="rotate(-25 180 250)">Gyan Marg</text>
          <text x="430" y="470" fontFamily="Poppins, sans-serif" fontSize="18" fill="#7A8CB8">Main Gate</text>
        </svg>
        <div className="campus-map__markers">
          {landmarks.map((lm) => (
            <button
              key={lm.id}
              type="button"
              ref={(el) => {
                if (el) markerRefs.current.set(lm.id, el);
                else markerRefs.current.delete(lm.id);
              }}
              className={`campus-map__marker${lm.id === activeId ? " is-active" : ""}`}
              style={{ left: `${lm.x}%`, top: `${lm.y}%`, ["--mk" as string]: `#${categoryColors[lm.category]}` }}
              aria-label={lm.name}
              onClick={() => select(lm)}
            >
              {lm.icon}
            </button>
          ))}
        </div>
        <div className="campus-map__popup" role="status" aria-live="polite" hidden={!active} style={popupStyle}>
          <button className="campus-map__popup-close" type="button" aria-label="Close popup" onClick={() => setActiveId(null)}>
            ×
          </button>
          {active && (
            <div className="campus-map__popup-body">
              <span className="campus-map__popup-icon">{active.icon}</span>
              <h4>{active.name}</h4>
              <span className="campus-map__popup-cat">{active.category}</span>
              <p>{active.desc}</p>
            </div>
          )}
        </div>
      </div>
      <aside className="campus-map__side">
        <h3>Places on campus</h3>
        <div className="campus-map__legend">
          {categories.map((c) => (
            <span key={c} className="campus-map__legend-item">
              <i style={{ background: `#${categoryColors[c]}` }} />
              {c}
            </span>
          ))}
        </div>
        <div className="campus-map__list">
          {landmarks.map((lm: Landmark) => (
            <button
              key={lm.id}
              type="button"
              className={`campus-map__place${lm.id === activeId ? " is-active" : ""}`}
              onClick={() => select(lm, true)}
            >
              <i style={{ background: `#${categoryColors[lm.category]}` }}>{lm.icon}</i>
              <span>
                <b>{lm.name}</b>
                <small>{lm.category}</small>
              </span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
