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
  { type: "a",    gets: "अ",  hint: "short a" },
  { type: "aa",   gets: "आ",  hint: "long aa" },
  { type: "i",    gets: "इ",  hint: "short i" },
  { type: "ii",   gets: "ई",  hint: "long ii" },
  { type: "u",    gets: "उ",  hint: "short u" },
  { type: "uu",   gets: "ऊ",  hint: "long uu" },
  { type: "e",    gets: "ए",  hint: "e sound" },
  { type: "ai",   gets: "ऐ",  hint: "ai sound" },
  { type: "o",    gets: "ओ",  hint: "o sound" },
  { type: "au",   gets: "औ",  hint: "au sound" },
  { type: "ka",   gets: "क",  hint: "k sound" },
  { type: "kha",  gets: "ख",  hint: "aspirated k" },
  { type: "ga",   gets: "ग",  hint: "g sound" },
  { type: "gha",  gets: "घ",  hint: "aspirated g" },
  { type: "nga",  gets: "ङ",  hint: "ng sound" },
  { type: "cha",  gets: "च",  hint: "ch sound" },
  { type: "chha", gets: "छ",  hint: "aspirated ch" },
  { type: "ja",   gets: "ज",  hint: "j sound" },
  { type: "jha",  gets: "झ",  hint: "aspirated j" },
  { type: "nya",  gets: "ञ",  hint: "nya sound" },
  { type: "Ta",   gets: "ट",  hint: "hard T (uppercase)" },
  { type: "Tha",  gets: "ठ",  hint: "hard Th (uppercase)" },
  { type: "Da",   gets: "ड",  hint: "hard D (uppercase)" },
  { type: "Dha",  gets: "ढ",  hint: "hard Dh (uppercase)" },
  { type: "Na",   gets: "ण",  hint: "hard N (uppercase)" },
  { type: "ta",   gets: "त",  hint: "soft t" },
  { type: "tha",  gets: "थ",  hint: "aspirated t" },
  { type: "da",   gets: "द",  hint: "soft d" },
  { type: "dha",  gets: "ध",  hint: "aspirated d" },
  { type: "na",   gets: "न",  hint: "n sound" },
  { type: "pa",   gets: "प",  hint: "p sound" },
  { type: "pha",  gets: "फ",  hint: "ph sound" },
  { type: "ba",   gets: "ब",  hint: "b sound" },
  { type: "bha",  gets: "भ",  hint: "bh sound" },
  { type: "ma",   gets: "म",  hint: "m sound" },
  { type: "ya",   gets: "य",  hint: "y sound" },
  { type: "ra",   gets: "र",  hint: "r sound" },
  { type: "la",   gets: "ल",  hint: "l sound" },
  { type: "va",   gets: "व",  hint: "v / w sound" },
  { type: "sha",  gets: "श",  hint: "sh (lowercase)" },
  { type: "Sha",  gets: "ष",  hint: "Sh (uppercase)" },
  { type: "sa",   gets: "स",  hint: "s sound" },
  { type: "ha",   gets: "ह",  hint: "h sound" },
  { type: "ksh",  gets: "क्ष", hint: "conjunct ksh" },
  { type: "tr",   gets: "त्र", hint: "conjunct tr" },
  { type: "jny",  gets: "ज्ञ", hint: "conjunct jny" },
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
    detail: "Uppercase T, D, Th, Dh give the hard retroflex sounds unique to Nepali. Same for sh vs Sh.",
    more: ["d → द  /  D → ड", "th → थ  /  Th → ठ", "dh → ध  /  Dh → ढ", "sh → श  /  Sh → ष"],
  },
  {
    label: "Special",
    heading: "Conjunct letters & extras",
    example: "ksh → क्ष   jny → ज्ञ",
    detail: "Some letters need a specific combo. nga, nya, ksh, jny are typed as shown.",
    more: ["nga → ङ", "nya → ञ", "ksh → क्ष", "jny → ज्ञ", "ph → फ", "v → व"],
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
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-1.5">
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
                </div>
              ))}
            </div>
          </div>

          {/* 3 rule cards side-by-side */}
          <div>
            <p className="text-[.68rem] font-bold uppercase tracking-widest text-[#718096] dark:text-[#8b95ab] mb-2.5">
              The 3 rules
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
