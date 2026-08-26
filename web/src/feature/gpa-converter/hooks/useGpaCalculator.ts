"use client";

import { useState, useCallback, useMemo } from "react";
import { calcGpa } from "../utils/gpa";
import type { Subject, GpaResult } from "../types";

let counter = 0;
const uid = () => `sub-${++counter}`;

const emptySubject = (): Subject => ({
  id:                 uid(),
  name:               "",
  creditHours:        "3",
  theoryFullMarks:    "",
  practicalFullMarks: "0",
  theoryObtained:     "",
  practicalObtained:  "0",
});

const INITIAL: Subject[] = [emptySubject(), emptySubject()];

const EMPTY_RESULT: GpaResult = {
  sgpa: 0, totalCredits: 0, totalGradePoints: 0, subjects: [], hasInvalid: false,
};

export function useGpaCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL);
  // Result is only updated when user clicks "Calculate GPA"
  const [result, setResult] = useState<GpaResult>(EMPTY_RESULT);
  const [calculated, setCalculated] = useState(false);

  const updateSubject = useCallback(
    (id: string, field: keyof Subject, value: string) => {
      setSubjects((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
      );
    },
    []
  );

  const addSubject = useCallback(() => {
    setSubjects((prev) => [...prev, emptySubject()]);
  }, []);

  const removeSubject = useCallback((id: string) => {
    setSubjects((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((s) => s.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    counter = 0;
    setSubjects([emptySubject(), emptySubject()]);
    setResult(EMPTY_RESULT);
    setCalculated(false);
  }, []);

  /** Snapshot the current result — only called on button click */
  const calculate = useCallback(() => {
    setResult(calcGpa(subjects));
    setCalculated(true);
  }, [subjects]);

  return { subjects, updateSubject, addSubject, removeSubject, clearAll, calculate, result, calculated };
}
