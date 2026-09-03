// src/types/feedback-page-settings.ts
// Configurable chrome for the public /feedback page AND the dynamic feedback
// form. The page content (SEO, hero, form intro, success copy) plus the actual
// form fields are all defined here and editable from the admin, so admins can
// add, remove, reorder and re-type the fields that face end users.
// Stored in the site_settings collection under key "feedback_page".

export type FeedbackFieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "checkbox"
  | "checkbox-group"
  | "select"
  | "radio"
  | "rating"
  | "image"
  | "document";

export interface FeedbackFieldConfig {
  id: string;
  label: string;
  type: FeedbackFieldType;
  required: boolean;
  placeholder?: string;
  hint?: string;
  min?: number;
  max?: number;
  options?: string[];
}

export interface FeedbackPageSettings {
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;
  breadcrumbLabel: string;

  // Form section heading
  formEyebrow: string;
  formTitle: string;
  formSubtitle: string;

  // Success + submit copy
  submitLabel: string;
  successTitle: string;
  successMessage: string;

  // Form options
  allowAnonymous: boolean;
  anonymousLabel: string;
  anonymousHint: string;
  ratingEnabled: boolean;
  ratingLabel: string;

  // Media
  heroImage: string;

  // Fully dynamic form fields
  fields: FeedbackFieldConfig[];
}

export const FEEDBACK_PAGE_SETTINGS_KEY = "feedback_page";

export const FEEDBACK_FIELD_TYPES: FeedbackFieldType[] = [
  "text",
  "textarea",
  "number",
  "email",
  "checkbox",
  "checkbox-group",
  "select",
  "radio",
  "rating",
  "image",
  "document",
];

export const FEEDBACK_PAGE_SETTINGS_DEFAULTS: FeedbackPageSettings = {
  seoTitle: "Feedback | Pokhara College of Management",
  seoDescription:
    "Submit feedback to PCM — share your suggestions, complaints or appreciation about academics, facilities, events and staff.",
  seoKeywords: [
    "PCM feedback",
    "Pokhara College of Management feedback",
    "student feedback PCM",
  ],
  ogImage: "/assets/img/hero-3.jpg",

  heroTitle: "Share Your Feedback",
  heroSubtitle:
    "Help us improve — your suggestions, comments and appreciations go directly to the team.",
  breadcrumbLabel: "Feedback",

  formEyebrow: "Your voice matters",
  formTitle: "Send us a message",
  formSubtitle:
    "All feedback is reviewed by the PCM management team. You may submit anonymously.",

  submitLabel: "Submit Feedback",
  successTitle: "Thank You!",
  successMessage:
    "Your feedback has been submitted successfully. We really appreciate your time.",

  allowAnonymous: true,
  anonymousLabel: "Submit anonymously",
  anonymousHint: "Your name and email will not be stored.",
  ratingEnabled: true,
  ratingLabel: "Overall rating",

  heroImage: "/assets/img/hero-3.jpg",

  fields: [
    { id: "name", label: "Your name", type: "text", required: false, placeholder: "How should we address you?", hint: "Optional" },
    { id: "email", label: "Email", type: "email", required: false, placeholder: "you@example.com", hint: "Optional, for follow-up" },
    { id: "category", label: "Category", type: "select", required: true, options: ["General", "Academics", "Facilities", "Events", "Staff", "Other"] },
    { id: "rating", label: "Overall rating", type: "number", required: true, min: 1, max: 5 },
    { id: "message", label: "Your feedback", type: "textarea", required: true, placeholder: "Share your suggestions, concerns or appreciation…" },
  ],
};
