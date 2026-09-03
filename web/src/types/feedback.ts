// src/types/feedback.ts
// Canonical schema mirrors the "feedback" collection (dynamic feedback form
// submissions from the public /feedback page).
import { ObjectId } from "mongodb";
import type { FeedbackFieldConfig } from "@/types/feedback-page-settings";

export const FEEDBACK_COLLECTION = "feedback";

// Submitted value shape. Keys are arbitrary — the admin defines the form via
// FeedbackPageSettings.fields, and submissions store whatever was collected.
export type FeedbackValue =
  | string
  | number
  | boolean
  | string[]
  | undefined
  | null;

// UI-facing shape used in the admin panel.
export interface Feedback {
  id: string;
  // Snapshot of the form schema at submit time, so labels/types can be
  // rendered correctly even if the configured form changes later.
  fieldSchema: FeedbackFieldConfig[];
  // Submitted field values keyed by field id (the `fields` payload).
  fields: Record<string, FeedbackValue>;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

// Database document shape ("feedback" collection).
export interface FeedbackDocument {
  _id?: ObjectId;
  fieldSchema?: FeedbackFieldConfig[];
  fields?: Record<string, FeedbackValue>;
  anonymous?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  deletedBy?: string;
  // Legacy submissions stored field values at the top level rather than
  // nested under `fields`. Preserved for backward compatibility.
  [key: string]: unknown;
}
