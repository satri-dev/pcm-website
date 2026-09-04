// src/types/testimonial.ts
// Canonical schema for the "testimonials" collection — public submissions that
// admins moderate (approve / reject) before they appear on the public page.

export type TestimonialStatus = "pending" | "approved" | "rejected";

export const TESTIMONIAL_STATUSES: readonly TestimonialStatus[] = [
  "pending",
  "approved",
  "rejected",
];

export const TESTIMONIALS_COLLECTION = "testimonials";

// UI-facing shape used in the public page and the admin panel.
export interface Testimonial {
  id: string;
  name: string;
  batch?: string;
  position?: string;
  program?: string;
  photo?: string;
  content: string;
  status: TestimonialStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

// Database document shape ("testimonials" collection).
export interface TestimonialDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  batch?: string;
  position?: string;
  program?: string;
  photo?: string;
  content: string;
  status: TestimonialStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

// Payload accepted by the repository when creating a testimonial.
export type TestimonialCreateInput = Omit<
  TestimonialDocument,
  "_id" | "createdAt" | "updatedAt" | "deletedAt" | "deletedBy"
>;

export type TestimonialUpdateInput = Partial<{
  name: string;
  batch: string;
  position: string;
  program: string;
  photo: string;
  content: string;
  status: TestimonialStatus;
}>;
