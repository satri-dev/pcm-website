"use client";

import { useState } from "react";

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const KeyboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
  </svg>
);

interface Props {
  eyebrow: string;
  title: string;
  inputLabel: string;
  inputPlaceholder: string;
  inputValue: string;
  outputLabel: string;
  outputPlaceholder: string;
  outputValue: string;
  /** Called on every onChange (handles paste / direct edits) */
  onInputChange: (text: string) => void;
  /**
   * Optional keydown handler for phonetic IME.
   * When provided the textarea intercepts key events and
   * converts Roman → Devanagari live.
   */
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onClear: () => void;
  onCopy: (text: string) => Promise<boolean>;
  inputLang?: string;
  outputLang?: string;
  /** Render the input textarea with Devanagari font */
  devanagariInput?: boolean;
  /** Show the phonetic input hint badge */
  phoneticHint?: boolean;
}

export default function ConverterPanel({
  eyebrow, title,
  inputLabel, inputPlaceholder, inputValue,
  outputLabel, outputPlaceholder, outputValue,
  onInputChange, onKeyDown, onClear, onCopy,
  inputLang, outputLang,
  devanagariInput = false,
  phoneticHint = false,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await onCopy(outputValue);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  const textareaBase =
    "w-full px-4 py-3 rounded-lg border border-[#e5e9f0] dark:border-[#273149] bg-white dark:bg-[#1a2340] text-[#16285b] dark:text-[#e4eaf7] leading-relaxed resize-y outline-none focus:border-[#21409a] focus:ring-2 focus:ring-[#21409a]/10 placeholder:text-[#718096] transition-colors";

  return (
    <div className="bg-white dark:bg-[#141b2e] border border-[#e5e9f0] dark:border-[#273149] rounded-2xl shadow-md p-6 flex flex-col gap-4">

      {/* ── Head ── */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold tracking-[.18em] uppercase text-[#21409a] dark:text-[#6d8af0]">
          {eyebrow}
        </span>
        <h2 className="text-xl font-semibold text-[#16285b] dark:text-[#e4eaf7] leading-tight m-0">
          {title}
        </h2>
      </div>

      {/* ── Phonetic hint badge ── */}
      {phoneticHint && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#edf2f9] dark:bg-[#1a2340] border border-[#e5e9f0] dark:border-[#273149]">
          <KeyboardIcon />
          <span className="text-xs text-[#21409a] dark:text-[#6d8af0] font-medium">
            Phonetic input active — type English letters to write Nepali
          </span>
          <span className="ml-auto text-[.68rem] text-[#718096] dark:text-[#8b95ab] font-mono tracking-wide hidden sm:inline">
            k→क &nbsp; kh→ख &nbsp; g→ग &nbsp; n→न
          </span>
        </div>
      )}

      {/* ── Input textarea ── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            className="text-sm font-semibold text-[#16285b] dark:text-[#e4eaf7]"
            htmlFor={`cv-in-${eyebrow}`}
          >
            {inputLabel}
          </label>
          <span className="text-xs text-[#718096]" aria-live="polite">
            {[...inputValue].length} chars
          </span>
        </div>

        <textarea
          id={`cv-in-${eyebrow}`}
          rows={5}
          className={`${textareaBase} text-base${devanagariInput ? " text-lg" : ""}`}
          style={devanagariInput
            ? { fontFamily: '"Noto Sans Devanagari", "Mangal", sans-serif' }
            : undefined}
          placeholder={inputPlaceholder}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          lang={inputLang}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="none"
          aria-label={inputLabel}
          aria-describedby={phoneticHint ? `cv-hint-${eyebrow}` : undefined}
        />

        {/* Accessible hint for screen readers */}
        {phoneticHint && (
          <p id={`cv-hint-${eyebrow}`} className="sr-only">
            Type Roman letters on your keyboard. They will be converted to Nepali Devanagari automatically.
          </p>
        )}
      </div>

      {/* ── Output textarea (read-only) ── */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-semibold text-[#718096] dark:text-[#8b95ab]"
          htmlFor={`cv-out-${eyebrow}`}
        >
          {outputLabel}
        </label>
        <textarea
          id={`cv-out-${eyebrow}`}
          rows={4}
          className={`${textareaBase} text-base bg-[#f4f7fb] dark:bg-[#0e1424] cursor-default`}
          style={outputLang === "ne"
            ? { fontFamily: '"Noto Sans Devanagari", "Mangal", sans-serif', fontSize: "1.1rem" }
            : undefined}
          placeholder={outputPlaceholder}
          value={outputValue}
          readOnly
          lang={outputLang}
          aria-label={outputLabel}
          aria-live="polite"
          tabIndex={-1}
        />
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!outputValue}
          aria-label="Copy result to clipboard"
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed
            ${copied
              ? "bg-green-50 dark:bg-green-900/20 border-[#51b747] text-[#51b747]"
              : "bg-[#edf2f9] dark:bg-[#1a2340] border-[#e5e9f0] dark:border-[#273149] text-[#21409a] dark:text-[#6d8af0] hover:border-[#21409a] dark:hover:border-[#6d8af0]"
            }`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied!" : "Copy"}
        </button>

        <button
          type="button"
          onClick={onClear}
          disabled={!inputValue}
          aria-label="Clear both fields"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border bg-[#edf2f9] dark:bg-[#1a2340] border-[#e5e9f0] dark:border-[#273149] text-[#21409a] dark:text-[#6d8af0] hover:border-[#21409a] dark:hover:border-[#6d8af0] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <TrashIcon /> Clear
        </button>
      </div>
    </div>
  );
}
