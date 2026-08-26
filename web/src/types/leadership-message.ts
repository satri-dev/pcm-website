export type LeadershipType = "Chairman" | "Principal" | "Director";
export type LeadershipStatus = "active" | "inactive";

export const LEADERSHIP_TYPES: readonly LeadershipType[] = [
  "Chairman",
  "Principal",
  "Director",
];

export const LEADERSHIP_STATUSES: readonly LeadershipStatus[] = ["active", "inactive"];

export const LEADERSHIP_MESSAGE_COLLECTION = "leadership_message";

export interface LeadershipMessage {
  id: string;
  name: string;
  type: LeadershipType;
  image: string;
  designation: string;
  message: string;
  email: string;
  phone: string;
  status: LeadershipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LeadershipMessageDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  type: LeadershipType;
  image: string;
  designation: string;
  message: string;
  email: string;
  phone: string;
  status: LeadershipStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadershipMessageCreateInput {
  name: string;
  type: LeadershipType;
  image: string;
  designation: string;
  message: string;
  email: string;
  phone: string;
  status: LeadershipStatus;
}

export type LeadershipMessageUpdateInput = Partial<LeadershipMessageCreateInput>;
