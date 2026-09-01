"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useConverter } from "@/feature/np-en-converter/hooks/useConverter";
import ConverterPanel from "@/feature/np-en-converter/components/ConverterPanel";
import RomanizationGuide from "@/feature/np-en-converter/components/RomanizationGuide";

/* ── inline SVGs ── */
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 opacity-50" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#21409a] dark:text-[#6d8af0]" aria-hidden="true">
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
  </svg>
);
const SwapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4" />
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#21409a] dark:text-[#6d8af0]" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const KeyboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#21409a] dark:text-[#6d8af0]" aria-hidden="true">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
  </svg>
);

/* anchor-link icons */
const RulesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);
const ArrowDownSmIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden="true">
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

const infoCards = [
  {
    icon: <BoltIcon />,
    title: "Phonetic input",
    desc: "Type English keys in the left box — Devanagari appears automatically.",
  },
  {
    icon: <GlobeIcon />,
    title: "Bidirectional",
    desc: "Works both ways: phonetic Nepali typing and Roman → Devanagari output.",
  },
  {
    icon: <KeyboardIcon />,
    title: "ITRANS standard",
    desc: 'k→क, kh→ख, ch→च, T→ट — standard ITRANS rules, type naturally.',
  },
];

export default function NpEnClient() {
  const rootRef = useRef<HTMLDivElement>(null);

  const {
    np2enInput,
    np2enOutput,
    phoneticKeyDown,
    handleNp2enDirectChange,
    en2npInput,
    en2npOutput,
    handleEn2npChange,
    clearNp2en,
    clearEn2np,
    copyToClipboard,
  } = useConverter();

  /* ── Reveal animation ── */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      items.forEach(el => { el.style.opacity = "1"; });
      return;
    }
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0)";
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.07 }
    );
    items.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "opacity .7s ease, transform .7s ease";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef}>

      {/* ── Page Hero ── */}
      <section className="relative bg-[#16285b] dark:bg-[#0a1020] overflow-hidden text-white/80">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1440 400"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
        </svg>

        <div className="relative z-10 w-[min(100%-2*clamp(1.25rem,4vw,2.5rem),1360px)] mx-auto py-[clamp(2.5rem,6vw,4.5rem)] grid gap-4">
          <nav className="flex flex-wrap items-center gap-1.5 text-[.74rem] tracking-[.04em] text-white/50 uppercase" aria-label="Breadcrumb">
            <Link href="/" className="text-[#51b747] dark:text-[#63c95a] hover:underline">Home</Link>
            <ChevronRight />
            <span>NP-EN Converter</span>
          </nav>
          <h1 className="text-white text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-tight tracking-tight m-0">
            Nepali ⇌ English Converter
          </h1>
          <p className="text-white/70 max-w-[56ch] text-[clamp(.9rem,2vw,1.05rem)] m-0">
            Type English keys to write Nepali — or type romanized English and see Devanagari live.
            No OS keyboard switch needed.
          </p>
        </div>
      </section>

      {/* ── Tool section ── */}
      <section className="py-[clamp(3rem,7vw,6rem)] bg-white dark:bg-[#0e1424]" id="converter">
        <div className="w-[min(100%-2*clamp(1.25rem,4vw,2.5rem),1360px)] mx-auto">

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10" data-reveal>
            {infoCards.map((card, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#141b2e] border border-[#e5e9f0] dark:border-[#273149] rounded-xl p-5 flex flex-col gap-3 shadow-sm"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-[#edf2f9] dark:bg-[#1a2340] grid place-items-center flex-none">
                  {card.icon}
                </div>
                <h3 className="text-base font-semibold text-[#16285b] dark:text-[#e4eaf7] m-0">{card.title}</h3>
                <p className="text-sm text-[#718096] dark:text-[#8b95ab] leading-relaxed m-0">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Bidirectional badge + typing rules anchor */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5" data-reveal>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#21409a] dark:bg-[#6d8af0] text-white text-xs font-bold tracking-[.06em] uppercase">
              <SwapIcon /> Bidirectional
            </span>
            <a
              href="#typing-rules"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#21409a] dark:text-[#6d8af0] hover:underline group"
            >
              <RulesIcon />
              Not sure how to type? See the typing rules below
              <ArrowDownSmIcon />
            </a>
          </div>

          {/* ── Two converter panels ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6" id="npen-np">

            {/* LEFT — phonetic Nepali input → Roman output */}
            <div data-reveal>
              <ConverterPanel
                eyebrow="Nepali → English"
                title="Type in Nepali"
                inputLabel="Nepali (Devanagari) — type Roman keys"
                inputPlaceholder="Type: na ma s te → नमस्ते"
                inputValue={np2enInput}
                outputLabel="Romanized English"
                outputPlaceholder="namaste, tapaailaai kasari maddat garna sakchhu?"
                outputValue={np2enOutput}
                onInputChange={handleNp2enDirectChange}
                onKeyDown={phoneticKeyDown}
                onClear={clearNp2en}
                onCopy={copyToClipboard}
                inputLang="ne"
                outputLang="en"
                devanagariInput
                phoneticHint
              />
            </div>

            {/* RIGHT — Roman input → Devanagari output */}
            <div data-reveal style={{ transitionDelay: "80ms" }} id="npen-en2">
              <ConverterPanel
                eyebrow="English → Nepali"
                title="Type in Roman"
                inputLabel="Romanized English"
                inputPlaceholder="namaste tapaailaai kasari maddat garna sakchhu?"
                inputValue={en2npInput}
                outputLabel="Nepali (Devanagari)"
                outputPlaceholder="नमस्ते तपाईंलाई कसरी मद्दत गर्न सक्छु?"
                outputValue={en2npOutput}
                onInputChange={handleEn2npChange}
                onClear={clearEn2np}
                onCopy={copyToClipboard}
                inputLang="en"
                outputLang="ne"
              />
            </div>
          </div>

          {/* Romanization guide */}
          <div className="mt-10" data-reveal>
            <RomanizationGuide />
          </div>

        </div>
      </section>

    </div>
  );
}
