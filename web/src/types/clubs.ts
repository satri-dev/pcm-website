export const CLUBS_COLLECTION = "clubs";

export interface ClubMember {
  photo: string;
  name: string;
  position: string;
  program: string;
}

export interface Club {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  image: string;
  desc: string;
  members: ClubMember[];
}

export interface ClubDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  icon: string;
  tagline: string;
  image: string;
  desc: string;
  members: ClubMember[];
}

export interface ClubCreateInput {
  name: string;
  icon?: string;
  tagline?: string;
  image?: string;
  desc?: string;
  members?: ClubMember[];
}

export type ClubUpdateInput = Partial<ClubCreateInput>;
