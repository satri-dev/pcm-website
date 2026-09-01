"use client";

import { useState, useCallback } from "react";
import type { Survey, SurveyAnswers, SurveyStatus } from "../types";
import { surveys } from "../data/surveys";

export function useSurvey() {
  const [status, setStatus]         = useState<SurveyStatus>("list");
  const [activeSurvey, setActive]   = useState<Survey | null>(null);
  const [answers, setAnswers]       = useState<SurveyAnswers>({});
  const [respondent, setRespondent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const openSurvey = useCallback((survey: Survey) => {
    setActive(survey);
    setAnswers({});
    setRespondent("");
    setServerError(null);
    setStatus("form");
  }, []);

  const backToList = useCallback(() => {
    setStatus("list");
    setActive(null);
    setAnswers({});
    setServerError(null);
  }, []);

  const setAnswer = useCallback((questionId: string, value: string | string[] | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const toggleCheckbox = useCallback((questionId: string, option: string) => {
    setAnswers(prev => {
      const current = (prev[questionId] as string[]) ?? [];
      const next = current.includes(option)
        ? current.filter(v => v !== option)
        : [...current, option];
      return { ...prev, [questionId]: next };
    });
  }, []);

  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSurvey) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyId: activeSurvey.id, respondent, answers }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setStatus("success");
    } catch {
      setServerError("Could not submit your response. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  }, [activeSurvey, respondent, answers]);

  return {
    surveys,
    status,
    activeSurvey,
    answers,
    respondent,
    setRespondent,
    submitting,
    serverError,
    openSurvey,
    backToList,
    setAnswer,
    toggleCheckbox,
    submit,
  };
}
