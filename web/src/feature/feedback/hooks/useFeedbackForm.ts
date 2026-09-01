"use client";

import { useState, useCallback } from "react";
import type { FeedbackFormData, FeedbackStatus, FeedbackCategory } from "../types";

const EMPTY: FeedbackFormData = {
  name: "",
  email: "",
  category: "General",
  rating: 0,
  message: "",
  anonymous: false,
};

export interface FeedbackErrors {
  message?: string;
  rating?: string;
  email?: string;
}

function validate(form: FeedbackFormData): FeedbackErrors {
  const errors: FeedbackErrors = {};
  if (!form.anonymous && form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Please enter a valid email address.";
  if (form.rating === 0)
    errors.rating = "Please select a rating.";
  if (!form.message.trim())
    errors.message = "Please share your feedback message.";
  return errors;
}

export function useFeedbackForm() {
  const [form, setForm] = useState<FeedbackFormData>(EMPTY);
  const [errors, setErrors] = useState<FeedbackErrors>({});
  const [status, setStatus] = useState<FeedbackStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const change = useCallback(<K extends keyof FeedbackFormData>(field: K, value: FeedbackFormData[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field in errors) setErrors(prev => ({ ...prev, [field]: undefined }));
  }, [errors]);

  const setCategory = useCallback((cat: FeedbackCategory) => change("category", cat), [change]);
  const setRating   = useCallback((r: number)             => change("rating", r),    [change]);
  const setAnon     = useCallback((v: boolean)             => change("anonymous", v), [change]);

  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) { setErrors(fieldErrors); return; }
    setStatus("submitting"); setErrors({}); setServerError(null);

    try {
      const res  = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok || !data.success) { setServerError(data.error ?? "Something went wrong."); setStatus("error"); return; }
      setStatus("success"); setForm(EMPTY);
    } catch {
      setServerError("Could not send your feedback. Please try again.");
      setStatus("error");
    }
  }, [form]);

  const reset = useCallback(() => { setStatus("idle"); setServerError(null); setForm(EMPTY); setErrors({}); }, []);

  return { form, errors, status, serverError, change, setCategory, setRating, setAnon, submit, reset };
}
