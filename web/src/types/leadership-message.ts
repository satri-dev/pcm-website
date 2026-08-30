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
  excerpt: string;
}

export interface LeadershipMessageDocument {
  _id?: import("mongodb").ObjectId;
  title: string;
  author: string;
  role: string;
  excerpt: string;
}

export interface LeadershipMessageCreateInput {
  title: string;
  author: string;
  role?: string;
  excerpt?: string;
}

export type LeadershipMessageUpdateInput = Partial<LeadershipMessageCreateInput>;
