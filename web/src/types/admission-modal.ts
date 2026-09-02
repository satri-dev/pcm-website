// src/types/admission-modal.ts
// Schema for the admission modal configuration and content

export const ADMISSION_MODAL_COLLECTION = "admissionModal";

export interface AdmissionModalSettings {
  enabled: boolean;
  delaySeconds: number;
  eyebrow: string;
  heading: string;
  description: string;
  primaryButton: {
    label: string;
    href: string;
  };
  secondaryButton: {
    label: string;
    href: string;
  };
  contactPhone: string;
}

export interface AdmissionModalData {
  id: string;
  settings: AdmissionModalSettings;
  updatedAt: string;
}

export interface AdmissionModalDocument {
  _id?: import("mongodb").ObjectId;
  settings: AdmissionModalSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdmissionModalUpdateInput {
  settings?: AdmissionModalSettings;
}

export const DEFAULT_ADMISSION_MODAL_DATA: Omit<AdmissionModalDocument, "_id" | "createdAt" | "updatedAt"> = {
  settings: {
    enabled: true,
    delaySeconds: 2,
    eyebrow: "Admissions Open · 2083 Intake",
    heading: "Join BBA, BBA-Finance & BCSIT",
    description: "Applications are open for the 2083 intake at Pokhara College of Management. Seats are limited and the deadline is close.",
    primaryButton: {
      label: "Apply Now",
      href: "/admission",
    },
    secondaryButton: {
      label: "Entrance Details",
      href: "/admission",
    },
    contactPhone: "(061) 544761",
  },
};
