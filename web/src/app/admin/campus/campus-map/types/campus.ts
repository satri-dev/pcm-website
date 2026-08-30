export type CampusMapCategory =
  | "Academic"
  | "Administration"
  | "Student Life"
  | "Sports"
  | "Library"
  | "IT";

export type CampusMapStatus = "published" | "draft";

export const CAMPUS_MAP_CATEGORIES: readonly CampusMapCategory[] = [
  "Academic",
  "Administration",
  "Student Life",
  "Sports",
  "Library",
  "IT",
];

export const CAMPUS_MAP_STATUSES: readonly CampusMapStatus[] = [
  "published",
  "draft",
];

export const CAMPUS_MAP_COLLECTION = "campus_map";

export interface CampusMapItem {
  id: string;
  name: string;
  category: CampusMapCategory;
  icon: string;
  positionX: number;
  positionY: number;
  description: string;
  status: CampusMapStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface CampusMapDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  category: CampusMapCategory;
  icon: string;
  positionX: number;
  positionY: number;
  description: string;
  status: CampusMapStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface CampusMapCreateInput {
  name: string;
  category: CampusMapCategory;
  icon: string;
  positionX: number;
  positionY: number;
  description: string;
  status: CampusMapStatus;
}

export type CampusMapUpdateInput = Partial<CampusMapCreateInput>;
