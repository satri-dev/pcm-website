import type { ObjectId } from "mongodb";

export interface FooterSettings {
  id: string;
  logoUrl: string; // Cloudinary URL
  tagline: string;
  address: string;
  phone: string;
  email: string;
  mapUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  whatsappNumber: string;
  
  // Opening Hours
  weekdaysHours: string;
  saturdayHours: string;
  
  // Affiliation
  affiliationText: string;
  affiliationBadge: string;
  
  // Newsletter
  newsletterTitle: string;
  newsletterDescription: string;
  
  // Bottom
  copyrightText: string;
  developerName: string;
  developerUrl: string;
  
  updatedAt: Date;
}

export interface FooterSettingsDocument extends Omit<FooterSettings, "id"> {
  _id: ObjectId;
}

export interface FooterSettingsUpdateInput {
  logoUrl?: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
  mapUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  whatsappNumber?: string;
  weekdaysHours?: string;
  saturdayHours?: string;
  affiliationText?: string;
  affiliationBadge?: string;
  newsletterTitle?: string;
  newsletterDescription?: string;
  copyrightText?: string;
  developerName?: string;
  developerUrl?: string;
}

// Footer Links (dynamic sections)
export interface FooterLink {
  id: string;
  title: string;
  links: { label: string; href: string; external?: boolean }[];
  order: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface FooterLinkDocument extends Omit<FooterLink, "id"> {
  _id: ObjectId;
}

export interface FooterLinkCreateInput {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
  order: number;
  status: "active" | "inactive";
}

export interface FooterLinkUpdateInput extends Partial<FooterLinkCreateInput> {}
