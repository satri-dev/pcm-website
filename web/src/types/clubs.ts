export type ClubCategory = "Academic" | "Sports" | "Cultural" | "Technical" | "Social";
export type ClubStatus = "active" | "inactive";

export const CLUB_CATEGORIES: readonly ClubCategory[] = [
  "Academic",
  "Sports",
  "Cultural",
  "Technical",
  "Social",
];

export const CLUB_STATUSES: readonly ClubStatus[] = ["active", "inactive"];

export const CLUBS_COLLECTION = "clubs";

export interface Club {
  id: string;
  name: string;
  category: ClubCategory;
  image: string;
  description: string;
  president: string;
  vicePresident: string;
  facultyCoordinator: string;
  email: string;
  phone: string;
  memberCount: number;
  status: ClubStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClubDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  category: ClubCategory;
  image: string;
  description: string;
  president: string;
  vicePresident: string;
  facultyCoordinator: string;
  email: string;
  phone: string;
  memberCount: number;
  status: ClubStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClubCreateInput {
  name: string;
  category: ClubCategory;
  image: string;
  description: string;
  president: string;
  vicePresident: string;
  facultyCoordinator: string;
  email: string;
  phone: string;
  memberCount: number;
  status: ClubStatus;
  featured?: boolean;
}

export type ClubUpdateInput = Partial<ClubCreateInput>;
