// src/types/application.ts
// Canonical schema mirrors the "applications" collection (admission form submissions)

export type ApplicationStatus = "new" | "in-review" | "accepted" | "rejected";

export const APPLICATION_STATUSES: readonly ApplicationStatus[] = [
  "new",
  "in-review",
  "accepted",
  "rejected",
];

export const APPLICATIONS_COLLECTION = "applications";

// Raw payload submitted from the public admission form.
// The admission form is fully dynamic — admins can add/edit/remove fields at
// every step — so we capture the whole form plus structured sections plus
// uploaded file URLs. Extra unknown keys are preserved as-is.

/** A single uploaded file entry — either a plain URL string (legacy) or an object with url + original name. */
export type FileEntry = string | { url: string; name: string };

export interface ApplicationSubmission {
  // Convenience columns surfaced in the admin table
  program?: string;
  shift?: string;
  name?: string;
  gender?: string;
  dob?: string;
  dateOption?: string;
  nationality?: string;
  phone?: string;
  email?: string;
  // Structured sections derived from the fixed fields
  guardian?: Record<string, string>;
  permanent?: Record<string, string>;
  temporary?: Record<string, string>;
  academic?: Record<string, string>;
  // Uploaded file entries — plain URLs (legacy) or {url, name} objects
  documents?: FileEntry[];
  paymentSlips?: FileEntry[];
  agreedToTerms?: boolean;
  // Complete raw form state (all fixed + dynamic field values keyed by field id)
  form?: Record<string, unknown>;
}

// UI-facing shape used in the admin panel
export interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  shift: string;
  status: ApplicationStatus;
  data: ApplicationSubmission;
  submittedAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

// Database document shape ("applications" collection)
export interface ApplicationDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  email: string;
  phone: string;
  program: string;
  shift: string;
  status: ApplicationStatus;
  data: ApplicationSubmission;
  submittedAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

// Payload accepted by the repository when creating an application
export type ApplicationCreateInput = Omit<
  ApplicationDocument,
  "_id" | "submittedAt" | "updatedAt" | "deletedAt" | "deletedBy"
>;

export type ApplicationUpdateInput = Partial<{
  name: string;
  email: string;
  phone: string;
  program: string;
  shift: string;
  status: ApplicationStatus;
  data: ApplicationSubmission;
}>;
