export const LEADERSHIP_MESSAGE_COLLECTION = "messages";

export const LEADERSHIP_ROLES: readonly string[] = [
  "Chairperson",
  "Founder Principal",
  "Principal",
  "BCSIT Coordinator",
  "BBA Coordinator (Morning)",
  "BBA Coordinator (Day)",
  "Faculty Member",
  "Administrator (Morning)",
  "Advisor",
  "Member",
];

export interface LeadershipMessage {
  id: string;
  title: string;
  author: string;
  role: string;
  order: number;
  excerpt: string;
  photo: string;
}

export interface LeadershipMessageDocument {
  _id?: import("mongodb").ObjectId;
  title: string;
  author: string;
  role: string;
  order: number;
  excerpt: string;
  photo: string;
}

export interface LeadershipMessageCreateInput {
  title: string;
  author: string;
  role?: string;
  order?: number;
  excerpt?: string;
  photo?: string;
}

export type LeadershipMessageUpdateInput = Partial<LeadershipMessageCreateInput>;
