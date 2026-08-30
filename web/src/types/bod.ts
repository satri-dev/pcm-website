export const BOD_COLLECTION = "board";

export interface Bod {
  id: string;
  name: string;
  role: string;
  order: number;
  photo: string;
}

export interface BodDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  role: string;
  order: number;
  photo: string;
}

export interface BodCreateInput {
  name: string;
  role: string;
  order?: number;
  photo?: string;
}

export type BodUpdateInput = Partial<BodCreateInput>;
