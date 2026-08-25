export interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export type FormStatus = "idle" | "submitting" | "success" | "error";

export interface ContactInfo {
  id: string;
  icon: "location" | "phone" | "email" | "hours";
  label: string;
  value: string;
  href?: string;
}
