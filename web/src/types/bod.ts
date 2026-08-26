export type BodStatus = "active" | "inactive";

export const BOD_STATUSES: readonly BodStatus[] = ["active", "inactive"];

export const BOD_COLLECTION = "bod";

export interface Bod {
  id: string;
  name: string;
  designation: string;
  image: string;
  email: string;
  phone: string;
  bio: string;
  sortOrder: number;
  status: BodStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BodDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  designation: string;
  image: string;
  email: string;
  phone: string;
  bio: string;
  sortOrder: number;
  status: BodStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface BodCreateInput {
  name: string;
  designation: string;
  image: string;
  email: string;
  phone: string;
  bio: string;
  sortOrder?: number;
  status: BodStatus;
}

export type BodUpdateInput = Partial<BodCreateInput>;
