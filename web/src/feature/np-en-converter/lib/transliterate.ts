/**
 * Bidirectional Nepali (Devanagari) ↔ Romanized English transliterator.
 * Uses ITRANS-style romanization, the same scheme referenced in np-en-converter.html.
 *
 * Nepali → Roman  : devanagariToRoman(text)
 * Roman  → Nepali : romanToDevanagari(text)
 */

/* ────────────────────────────────────────────────────────────
   Devanagari Unicode constants
   ──────────────────────────────────────────────────────────── */
const VIRAMA   = "\u094D"; // halant (suppresses inherent 'a')
const ANUSVARA = "\u0902"; // ं
const VISARGA  = "\u0903"; // ः
const CHANDRABINDU = "\u0901"; // ँ

/* ────────────────────────────────────────────────────────────
   Vowel letters (standalone) → Roman
   ──────────────────────────────────────────────────────────── */
const VOWEL_LETTERS: [string, string][] = [
  ["\u0905", "a"],   // अ
  ["\u0906", "aa"],  // आ
  ["\u0907", "i"],   // इ
  ["\u0908", "ii"],  // ई
  ["\u0909", "u"],   // उ
  ["\u090A", "uu"],  // ऊ
  ["\u090B", "ri"],  // ऋ
  ["\u090F", "e"],   // ए
  ["\u0910", "ai"],  // ऐ
  ["\u0913", "o"],   // ओ
  ["\u0914", "au"],  // औ
];

/* ────────────────────────────────────────────────────────────
   Vowel matras (dependent) → Roman
   ──────────────────────────────────────────────────────────── */
const MATRA_MAP: Record<string, string> = {
  "\u093E": "aa", // ा
  "\u093F": "i",  // ि
  "\u0940": "ii", // ी
  "\u0941": "u",  // ु
  "\u0942": "uu", // ू
  "\u0943": "ri", // ृ
  "\u0947": "e",  // े
  "\u0948": "ai", // ै
  "\u094B": "o",  // ो
  "\u094C": "au", // ौ
};

/* ────────────────────────────────────────────────────────────
   Consonants → Roman (inherent 'a' added later)
   ──────────────────────────────────────────────────────────── */
const CONSONANT_MAP: [string, string][] = [
  ["\u0915", "k"],   // क
  ["\u0916", "kh"],  // ख
  ["\u0917", "g"],   // ग
  ["\u0918", "gh"],  // घ
  ["\u0919", "nga"], // ङ
  ["\u091A", "ch"],  // च
  ["\u091B", "chh"], // छ
  ["\u091C", "j"],   // ज
  ["\u091D", "jh"],  // झ
  ["\u091E", "nya"], // ञ
  ["\u091F", "T"],   // ट
  ["\u0920", "Th"],  // ठ
  ["\u0921", "D"],   // ड
  ["\u0922", "Dh"],  // ढ
  ["\u0923", "N"],   // ण
  ["\u0924", "t"],   // त
  ["\u0925", "th"],  // थ
  ["\u0926", "d"],   // द
  ["\u0927", "dh"],  // ध
  ["\u0928", "n"],   // न
  ["\u092A", "p"],   // प
  ["\u092B", "ph"],  // फ
  ["\u092C", "b"],   // ब
  ["\u092D", "bh"],  // भ
  ["\u092E", "m"],   // म
  ["\u092F", "y"],   // य
  ["\u0930", "r"],   // र
  ["\u0932", "l"],   // ल
  ["\u0935", "v"],   // व
  ["\u0936", "sh"],  // श
  ["\u0937", "Sh"],  // ष
  ["\u0938", "s"],   // स
  ["\u0939", "h"],   // ह
  ["\u0915\u094D\u0937", "ksh"], // क्ष
  ["\u0924\u094D\u0930", "tr"],  // त्र
  ["\u091C\u094D\u091E", "jny"], // ज्ञ
];

/* ────────────────────────────────────────────────────────────
   Nepali digits
   ──────────────────────────────────────────────────────────── */
const NEPALI_DIGITS: Record<string, string> = {
  "\u0966": "0", "\u0967": "1", "\u0968": "2", "\u0969": "3",
  "\u096A": "4", "\u096B": "5", "\u096C": "6", "\u096D": "7",
  "\u096E": "8", "\u096F": "9",
};

/* ────────────────────────────────────────────────────────────
   Build lookup maps
   ──────────────────────────────────────────────────────────── */
const consonantToRoman = new Map<string, string>(CONSONANT_MAP);
const vowelLetterToRoman = new Map<string, string>(VOWEL_LETTERS);

/** ── DEVANAGARI → ROMAN ─────────────────────────────────── */
export function devanagariToRoman(input: string): string {
  if (!input.trim()) return "";
  const chars = [...input]; // handles multi-codepoint safely
  let result = "";
  let i = 0;

  while (i < chars.length) {
    const ch = chars[i];

    // Nepali digit
    if (NEPALI_DIGITS[ch]) { result += NEPALI_DIGITS[ch]; i++; continue; }

    // Anusvara → m / n (simplified)
    if (ch === ANUSVARA) { result += "n"; i++; continue; }
    if (ch === CHANDRABINDU) { result += "n"; i++; continue; }

    // Visarga → h
    if (ch === VISARGA) { result += "h"; i++; continue; }

    // Virama — skip (handled by consonant look-ahead)
    if (ch === VIRAMA) { i++; continue; }

    // Vowel letters (standalone)
    const vLetter = vowelLetterToRoman.get(ch);
    if (vLetter) { result += vLetter; i++; continue; }

    // Consonant
    const conRoman = consonantToRoman.get(ch);
    if (conRoman !== undefined) {
      result += conRoman;
      const next1 = chars[i + 1];
      const next2 = chars[i + 2];

      if (next1 === VIRAMA) {
        // Halant: no inherent 'a', skip virama
        i += 2;
      } else if (next1 && MATRA_MAP[next1]) {
        // Followed by a matra
        result += MATRA_MAP[next1];
        i += 2;
      } else if (next1 === ANUSVARA) {
        // Inherent 'a' then anusvara
        result += "a" + "n";
        i += 2;
      } else if (next1 === CHANDRABINDU) {
        result += "a" + "n";
        i += 2;
      } else if (next1 === VISARGA) {
        result += "a" + "h";
        i += 2;
      } else if (next2 === VIRAMA && next1) {
        // Consonant cluster starting here — inherent 'a' suppressed by next consonant's virama? No:
        // Just add inherent 'a' always unless followed by virama
        result += "a";
        i++;
      } else {
        // Add inherent 'a'
        result += "a";
        i++;
      }
      continue;
    }

    // Matra without preceding consonant (shouldn't happen in clean text)
    const matra = MATRA_MAP[ch];
    if (matra) { result += matra; i++; continue; }

    // Pass-through (spaces, punctuation, digits, etc.)
    result += ch;
    i++;
  }

  return result;
}

/* ────────────────────────────────────────────────────────────
   Build Roman → Devanagari map
   Ordered longest-match first to avoid ambiguity
   ──────────────────────────────────────────────────────────── */

// consonant roman → { unicode, matra? }
// We store the base consonant codepoint; matra is added for vowels
type CEntry = { base: string; matra?: string };

// Roman vowel → { standalone, matra }
const ROMAN_VOWELS: [string, string, string][] = [
  // roman  standalone   matra
  ["aa",  "\u0906", "\u093E"],
  ["ii",  "\u0908", "\u0940"],
  ["uu",  "\u090A", "\u0942"],
  ["ai",  "\u0910", "\u0948"],
  ["au",  "\u0914", "\u094C"],
  ["ri",  "\u090B", "\u0943"],
  ["a",   "\u0905", ""],      // empty matra = inherent
  ["i",   "\u0907", "\u093F"],
  ["u",   "\u0909", "\u0941"],
  ["e",   "\u090F", "\u0947"],
  ["o",   "\u0913", "\u094B"],
];

// Roman → [standalone vowel, matra]
const romanToVowel = new Map<string, [string, string]>(
  ROMAN_VOWELS.map(([r, s, m]) => [r, [s, m]])
);

// Roman → Devanagari consonant (longest match first)
const ROMAN_CONSONANTS: [string, string][] = [
  ["ksh", "\u0915\u094D\u0937"],
  ["jny", "\u091C\u094D\u091E"],
  ["tr",  "\u0924\u094D\u0930"],
  ["nga", "\u0919"],
  ["nya", "\u091E"],
  ["chh", "\u091B"],
  ["ch",  "\u091A"],
  ["kh",  "\u0916"],
  ["gh",  "\u0918"],
  ["jh",  "\u091D"],
  ["Th",  "\u0920"],
  ["Dh",  "\u0922"],
  ["th",  "\u0925"],
  ["dh",  "\u0927"],
  ["ph",  "\u092B"],
  ["bh",  "\u092D"],
  ["sh",  "\u0936"],
  ["Sh",  "\u0937"],
  ["k",   "\u0915"],
  ["g",   "\u0917"],
  ["j",   "\u091C"],
  ["T",   "\u091F"],
  ["D",   "\u0921"],
  ["N",   "\u0923"],
  ["t",   "\u0924"],
  ["d",   "\u0926"],
  ["n",   "\u0928"],
  ["p",   "\u092A"],
  ["b",   "\u092C"],
  ["m",   "\u092E"],
  ["y",   "\u092F"],
  ["r",   "\u0930"],
  ["l",   "\u0932"],
  ["v",   "\u0935"],
  ["s",   "\u0938"],
  ["h",   "\u0939"],
];

// Build sorted by length desc
const romanConsonantsSorted = [...ROMAN_CONSONANTS].sort((a, b) => b[0].length - a[0].length);
const romanVowelsSorted = [...ROMAN_VOWELS].sort((a, b) => b[0].length - a[0].length);

/** ── ROMAN → DEVANAGARI ────────────────────────────────── */
export function romanToDevanagari(input: string): string {
  if (!input.trim()) return "";
  let result = "";
  let i = 0;

  while (i < input.length) {
    // Skip non-alpha (spaces, digits, punctuation)
    if (!/[a-zA-Z]/.test(input[i])) {
      // Convert ASCII digits to Nepali digits
      const d = input[i];
      if (d >= "0" && d <= "9") {
        const nepaliDigit = String.fromCharCode(0x0966 + parseInt(d));
        result += nepaliDigit;
      } else {
        result += d;
      }
      i++;
      continue;
    }

    // Try to match a consonant at position i
    let matchedCons: string | null = null;
    let consLen = 0;
    for (const [roman, dev] of romanConsonantsSorted) {
      if (input.startsWith(roman, i)) {
        matchedCons = dev;
        consLen = roman.length;
        break;
      }
    }

    if (matchedCons) {
      result += matchedCons;
      i += consLen;

      // Now look for a following vowel
      let matchedVowel: [string, string] | null = null;
      let vowelLen = 0;
      for (const [roman, standalone, matra] of romanVowelsSorted) {
        if (input.startsWith(roman, i)) {
          matchedVowel = [standalone, matra];
          vowelLen = roman.length;
          break;
        }
      }

      if (matchedVowel) {
        const [, matra] = matchedVowel;
        if (matra === "") {
          // inherent 'a' — add nothing (it's implicit)
        } else {
          result += matra;
        }
        i += vowelLen;
      } else if (i < input.length && /[a-zA-Z]/.test(input[i])) {
        // Next char is a letter but not a vowel we recognise — add virama
        // (consonant cluster)
        result += VIRAMA;
      } else {
        // End of word / non-letter — add inherent 'a' implicitly (no extra char)
      }
      continue;
    }

    // Try standalone vowel (at word boundary / after another vowel)
    let matchedSV: [string, string] | null = null;
    let svLen = 0;
    for (const [roman, standalone, matra] of romanVowelsSorted) {
      if (input.startsWith(roman, i)) {
        matchedSV = [standalone, matra];
        svLen = roman.length;
        break;
      }
    }

    if (matchedSV) {
      result += matchedSV[0]; // standalone vowel letter
      i += svLen;
      continue;
    }

    // Unrecognised — pass through
    result += input[i];
    i++;
  }

  return result;
}
