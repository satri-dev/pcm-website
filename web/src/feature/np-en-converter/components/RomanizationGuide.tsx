"use client";

import { useState } from "react";

/* ── icons ── */
const ArrowDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-3 h-3 flex-none">
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);
const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    className={`w-4 h-4 flex-none transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    className="w-3 h-3 flex-none text-[#51b747] dark:text-[#63c95a]">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* ── data ── */
const examples = [
  { type: "na",  gets: "न",  hint: "n + a" },
  { type: "ma",  gets: "म",  hint: "m + a" },
  { type: "ka",  gets: "क",  hint: "k sound" },
  { type: "kha", gets: "ख",  hint: "aspirated k" },
  { type: "ga",  gets: "ग",  hint: "g sound" },
  { type: "cha", gets: "च",  hint: "ch sound" },
  { type: "ta",  gets: "त",  hint: "soft t" },
  { type: "Ta",  gets: "ट",  hint: "hard T" },
  { type: "da",  gets: "द",  hint: "soft d" },
  { type: "Da",  gets: "ड",  hint: "hard D" },
  { type: "sha", gets: "श",  hint: "sh sound" },
  { type: "sa",  gets: "स",  hint: "s sound" },
  { type: "ra",  gets: "र",  hint: "r sound" },
  { type: "la",  gets: "ल",  hint: "l sound" },
  { type: "ha",  gets: "ह",  hint: "h sound" },
  { type: "ya",  gets: "य",  hint: "y sound" },
];

const rules = [
  {
    label: "Rule 1",
    heading: "Long vowel = double the letter",
    example: "a → अ   but   aa → आ",
    detail: "One letter = short sound. Same letter twice = long sound.",
    more: ["i → इ  /  ii → ई", "u → उ  /  uu → ऊ", "e → ए  /  ai → ऐ", "o → ओ  /  au → औ"],
  },
  {
    label: "Rule 2",
    heading: "Breathy consonant = add h after",
    example: "k → क   but   kh → ख",
    detail: 'Add "h" after any consonant to get the breathy (aspirated) version.',
    more: ["g → ग  /  gh → घ", "ch → च  /  chh → छ", "p → प  /  ph → फ", "b → ब  /  bh → भ", "t → त  /  th → थ", "d → द  /  dh → ध"],
  },
  {
    label: "Rule 3",
    heading: "Hard consonant = Uppercase letter",
    example: "t → त   but   T → ट",
    detail: "Uppercase T, D, Th, Dh give the hard retroflex sounds unique to Nepali.",
    more: ["d → द  /  D → ड", "th → थ  /  Th → ठ", "dh → ध  /  Dh → ढ", "sh → श  /  Sh → ष"],
  },
];

export default function RomanizationGuide() {
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <div id="typing-rules" className="scroll-mt-24 bg-[#f4f7fb] dark:bg-[#141b2e] border border-[#e5e9f0] dark:border-[#273149] rounded-2xl overflow-hidden">

      {/* ── Header + toggle trigger — always visible ── */}
      <button
        type="button"
        onClick={() => setRulesOpen(p => !p)}
        aria-expanded={rulesOpen}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-[#edf2f9] dark:hover:bg-[#1a2340] transition-colors text-left"
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-[.68rem] font-bold tracking-[.18em] uppercase text-[#21409a] dark:text-[#6d8af0]">
            How to type
          </span>
          <span className="text-base font-semibold text-[#16285b] dark:text-[#e4eaf7] leading-tight">
            Typing rules &amp; quick examples
          </span>
        </div>
        <div className="flex items-center gap-2 flex-none">
          <span className="text-xs text-[#718096] dark:text-[#8b95ab] hidden sm:inline">
            {rulesOpen ? "Hide" : "Show all rules"}
          </span>
          <ChevronDownIcon open={rulesOpen} />
        </div>
      </button>

      {/* ── Collapsible body ── */}
      {rulesOpen && (
        <div className="border-t border-[#e5e9f0] dark:border-[#273149] px-5 py-5 flex flex-col gap-6">

          {/* quick-example tiles */}
          <div>
            <p className="text-[.68rem] font-bold uppercase tracking-widest text-[#718096] dark:text-[#8b95ab] mb-2.5">
              Quick examples — try typing these
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {examples.map((ex, i) => (
                <div
                  key={i}
                  title={ex.hint}
                  className="bg-white dark:bg-[#0e1424] border border-[#e5e9f0] dark:border-[#273149] rounded-lg p-2 flex flex-col items-center gap-0.5 hover:border-[#21409a] dark:hover:border-[#6d8af0] transition-colors cursor-default"
                >
                  <code className="text-[.7rem] font-mono font-bold text-[#21409a] dark:text-[#6d8af0] bg-[#edf2f9] dark:bg-[#1e2a44] px-1.5 py-0.5 rounded">
                    {ex.type}
                  </code>
                  <ArrowDownIcon />
                  <span
                    className="text-lg leading-none text-[#16285b] dark:text-[#e4eaf7]"
                    style={{ fontFamily: '"Noto Sans Devanagari", "Mangal", sans-serif' }}
                  >
                    {ex.gets}
                  </span>
                  <span className="text-[.58rem] text-[#718096] dark:text-[#8b95ab] text-center leading-tight hidden sm:block">
                    {ex.hint}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 rule cards side-by-side */}
          <div>
            <p className="text-[.68rem] font-bold uppercase tracking-widest text-[#718096] dark:text-[#8b95ab] mb-2.5">
              The 3 rules
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {rules.map((r, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#0e1424] border border-[#e5e9f0] dark:border-[#273149] rounded-xl p-4 flex flex-col gap-2"
                >
                  {/* label + heading */}
                  <div className="flex items-center gap-2">
                    <span className="text-[.62rem] font-bold uppercase tracking-[.1em] text-[#21409a] dark:text-[#6d8af0] bg-[#edf2f9] dark:bg-[#1e2a44] px-2 py-0.5 rounded-full whitespace-nowrap">
                      {r.label}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#16285b] dark:text-[#e4eaf7] m-0 leading-snug">
                    {r.heading}
                  </p>
                  {/* main example */}
                  <code className="text-[.72rem] font-mono bg-[#edf2f9] dark:bg-[#1e2a44] text-[#21409a] dark:text-[#6d8af0] px-2.5 py-1.5 rounded-lg border border-[#e5e9f0] dark:border-[#273149] self-start whitespace-nowrap">
                    {r.example}
                  </code>
                  {/* detail */}
                  <p className="text-[.72rem] text-[#718096] dark:text-[#8b95ab] m-0 leading-relaxed">
                    {r.detail}
                  </p>
                  {/* more examples */}
                  <ul className="flex flex-col gap-1 mt-0.5">
                    {r.more.map((m, j) => (
                      <li key={j} className="flex items-center gap-1.5 text-[.7rem] text-[#4a5568] dark:text-[#b8c2d6]">
                        <CheckIcon />
                        <code className="font-mono">{m}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
