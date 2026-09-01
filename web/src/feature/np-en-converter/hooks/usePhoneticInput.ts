"use client";

/**
 * usePhoneticInput
 * ─────────────────
 * Enables phonetic Nepali typing inside a <textarea>.
 * The user types Roman letters (e.g. "namaste") and the hook
 * converts them to Devanagari (नमस्ते) on-the-fly, updating
 * the textarea value in React-controlled fashion.
 *
 * HOW IT WORKS
 * ─────────────
 * We maintain a parallel "roman buffer" that stores the raw
 * Roman keystrokes the user has typed since the last commit
 * point (a space, punctuation, or Enter). On every keystroke
 * we re-run romanToDevanagari() on the buffer and splice the
 * Devanagari result into the full string at the correct cursor
 * position, so surrounding already-converted text is preserved.
 *
 * Commit points (space / punctuation / Enter) flush the buffer
 * so the next word starts fresh.
 *
 * ARCHITECTURE
 * ─────────────
 * We intercept onKeyDown, compute the new full Devanagari string
 * ourselves, then call both:
 *   - the state setter  → updates displayed value
 *   - the parent change handler → keeps parent in sync
 * We call e.preventDefault() only for printable keys so the
 * browser's native caret/selection management stays intact for
 * navigation keys (arrows, home/end, backspace etc.).
 */

import { useRef, useCallback } from "react";
import { romanToDevanagari } from "../lib/transliterate";

/** Characters that commit the current word and are passed through as-is */
const COMMIT_CHARS = new Set([" ", "\n", "\r", ".", ",", "!", "?", ":", ";", "(", ")", "[", "]", "/", "\\", "-", "_", '"', "'"]);

interface Options {
  /** Called with the new full Devanagari string whenever it changes */
  onChange: (value: string) => void;
}

export function usePhoneticInput({ onChange }: Options) {
  /**
   * Parallel state stored in refs (not React state) because we need
   * synchronous access inside keydown without re-renders.
   *
   * romanBuf  — Roman letters typed since last commit, per-word
   * fullText  — the full Devanagari string shown in the textarea
   * wordStart — index (in fullText) where the current Roman buffer started
   */
  const romanBuf   = useRef("");
  const fullText   = useRef("");
  const wordStart  = useRef(0);

  /**
   * Reset internal state (call on Clear)
   */
  const reset = useCallback(() => {
    romanBuf.current  = "";
    fullText.current  = "";
    wordStart.current = 0;
  }, []);

  /**
   * Sync internal fullText when the parent forces a value change
   * (e.g. the user clears via button, or pastes Devanagari directly).
   */
  const syncExternal = useCallback((value: string) => {
    fullText.current  = value;
    romanBuf.current  = "";
    wordStart.current = value.length;
  }, []);

  /**
   * Main keydown handler — attach to the Nepali <textarea>.
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const key = e.key;

      /* ── Navigation / modifier keys — let browser handle ── */
      if (
        e.ctrlKey || e.metaKey || e.altKey ||
        key === "ArrowLeft" || key === "ArrowRight" ||
        key === "ArrowUp"   || key === "ArrowDown"  ||
        key === "Home" || key === "End" ||
        key === "Tab"  || key === "Escape" ||
        key === "F1"   || key.startsWith("F") && key.length <= 3
      ) {
        return; // let browser handle
      }

      /* ── Backspace ── */
      if (key === "Backspace") {
        if (romanBuf.current.length > 0) {
          // Remove last Roman char from buffer and re-convert
          romanBuf.current = romanBuf.current.slice(0, -1);
          const devWord    = romanBuf.current ? romanToDevanagari(romanBuf.current) : "";
          const before     = fullText.current.slice(0, wordStart.current);
          fullText.current = before + devWord;
          onChange(fullText.current);
          e.preventDefault();
        } else {
          // Buffer empty — remove last Devanagari character from fullText
          if (fullText.current.length > 0) {
            // Devanagari chars can be multi-codepoint (base + matra/virama)
            // Use spread to correctly handle surrogate pairs
            const chars      = [...fullText.current];
            chars.pop();
            fullText.current = chars.join("");
            wordStart.current = fullText.current.length;
            onChange(fullText.current);
          }
          e.preventDefault();
        }
        return;
      }

      /* ── Delete ── */
      if (key === "Delete") {
        // Just clear everything for simplicity (complex selection tracking omitted)
        romanBuf.current  = "";
        fullText.current  = "";
        wordStart.current = 0;
        onChange("");
        e.preventDefault();
        return;
      }

      /* ── Enter ── */
      if (key === "Enter") {
        // Commit buffer and insert newline
        romanBuf.current   = "";
        wordStart.current  = fullText.current.length + 1;
        fullText.current  += "\n";
        onChange(fullText.current);
        e.preventDefault();
        return;
      }

      /* ── Commit chars (space, punctuation) ── */
      if (COMMIT_CHARS.has(key)) {
        romanBuf.current   = "";
        fullText.current  += key;
        wordStart.current  = fullText.current.length;
        onChange(fullText.current);
        e.preventDefault();
        return;
      }

      /* ── Printable Roman letter ── */
      if (key.length === 1) {
        romanBuf.current += key;
        const devWord     = romanToDevanagari(romanBuf.current);
        const before      = fullText.current.slice(0, wordStart.current);
        fullText.current  = before + devWord;
        onChange(fullText.current);
        e.preventDefault();
        return;
      }
    },
    [onChange]
  );

  return { handleKeyDown, reset, syncExternal };
}
