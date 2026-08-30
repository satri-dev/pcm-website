export const LEADERSHIP_MESSAGE_COLLECTION = "messages";

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
