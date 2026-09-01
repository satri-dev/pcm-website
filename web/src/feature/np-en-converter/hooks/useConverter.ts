"use client";

import { useState, useCallback } from "react";
import { devanagariToRoman, romanToDevanagari } from "../lib/transliterate";
import { usePhoneticInput } from "./usePhoneticInput";

export function useConverter() {
  /* ── Nepali → Roman state ── */
  const [np2enInput,  setNp2enInput]  = useState("");   // Devanagari shown in textarea
  const [np2enOutput, setNp2enOutput] = useState("");   // Roman output

  /* ── Roman → Nepali state ── */
  const [en2npInput,  setEn2npInput]  = useState("");   // Roman shown in textarea
  const [en2npOutput, setEn2npOutput] = useState("");   // Devanagari output

  /* ── Phonetic IME for the Nepali-input textarea ──
     User types Roman keystrokes → hook converts to Devanagari
     → we store the Devanagari in np2enInput and derive output  */
  const onPhoneticChange = useCallback((devanagari: string) => {
    setNp2enInput(devanagari);
    setNp2enOutput(devanagari ? devanagariToRoman(devanagari) : "");
  }, []);

  const { handleKeyDown: phoneticKeyDown, reset: phoneticReset, syncExternal } = usePhoneticInput({
    onChange: onPhoneticChange,
  });

  /* ── Roman → Nepali: live as user types ── */
  const handleEn2npChange = useCallback((text: string) => {
    setEn2npInput(text);
    setEn2npOutput(text ? romanToDevanagari(text) : "");
  }, []);

  /* ── Clear handlers ── */
  const clearNp2en = useCallback(() => {
    phoneticReset();
    setNp2enInput("");
    setNp2enOutput("");
  }, [phoneticReset]);

  const clearEn2np = useCallback(() => {
    setEn2npInput("");
    setEn2npOutput("");
  }, []);

  /* ── Handle paste / direct edit into Nepali textarea ──
     If the user pastes Devanagari directly (instead of typing),
     we sync the phonetic hook's internal state.              */
  const handleNp2enDirectChange = useCallback((text: string) => {
    syncExternal(text);
    setNp2enInput(text);
    setNp2enOutput(text ? devanagariToRoman(text) : "");
  }, [syncExternal]);

  /* ── Clipboard ── */
  async function copyToClipboard(text: string): Promise<boolean> {
    if (!text) return false;
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  return {
    /* Nepali → Roman panel */
    np2enInput,
    np2enOutput,
    phoneticKeyDown,        // attach to onKeyDown of Nepali textarea
    handleNp2enDirectChange, // attach to onChange (handles paste)

    /* Roman → Nepali panel */
    en2npInput,
    en2npOutput,
    handleEn2npChange,

    /* Shared */
    clearNp2en,
    clearEn2np,
    copyToClipboard,
  };
}
