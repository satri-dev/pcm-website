"use client";

import { useState, useCallback } from "react";
import type { ContactFormData, FormStatus } from "../types";

const EMPTY: ContactFormData = {
  fullName: "",
  phone: "",
  email: "",
  subject: "Admissions enquiry",
  message: "",
};

export interface FieldErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  message?: string;
}

// Nepali mobile: starts with 98/97/96 (10 digits), or landline 06x (7 digits),
// or international +977-xxx format. We allow spaces, hyphens, parens, + prefix.
const PHONE_RE = /^[+]?[\d\s\-().]{7,15}$/;

function validate(data: ContactFormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.fullName.trim()) errors.fullName = "Full name is required.";
  if (!data.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (data.phone.trim() && !PHONE_RE.test(data.phone.trim())) {
    errors.phone = "Enter a valid phone number (digits, spaces, + or - only).";
  }
  if (!data.message.trim()) errors.message = "Message is required.";
  return errors;
}

export function useContactForm() {
  const [form, setForm] = useState<ContactFormData>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const change = useCallback(
    (field: keyof ContactFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field as keyof FieldErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Client-side validation first
      const fieldErrors = validate(form);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        return;
      }

      setStatus("submitting");
      setErrors({});
      setServerError(null);

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setServerError(
            data.error ?? "Something went wrong. Please try again."
          );
          setStatus("error");
          return;
        }

        setStatus("success");
        setForm(EMPTY);
      } catch {
        setServerError(
          "Could not send your message. Please check your connection and try again."
        );
        setStatus("error");
      }
    },
    [form]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setServerError(null);
    setForm(EMPTY);
    setErrors({});
  }, []);

  return { form, errors, status, serverError, change, submit, reset };
}
