export type FeedbackCategory =
  | "General"
  | "Academics"
  | "Facilities"
  | "Events"
  | "Staff"
  | "Other";

export interface FeedbackFormData {
  name: string;
  email: string;
  category: FeedbackCategory;
  rating: number;          // 1–5, 0 = not rated
  message: string;
  anonymous: boolean;
}

export type FeedbackStatus = "idle" | "submitting" | "success" | "error";
