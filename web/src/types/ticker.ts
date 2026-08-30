// src/types/ticker.ts

export const TICKER_COLLECTION = "tickers";

export interface Ticker {
  id: string;
  message: string;
  linkText?: string;
  linkUrl?: string;
  status: "active" | "inactive";
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TickerDocument {
  _id?: import("mongodb").ObjectId;
  message: string;
  linkText?: string;
  linkUrl?: string;
  status: "active" | "inactive";
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface TickerCreateInput {
  message: string;
  linkText?: string;
  linkUrl?: string;
  status: "active" | "inactive";
  order: number;
}

export interface TickerUpdateInput {
  message?: string;
  linkText?: string;
  linkUrl?: string;
  status?: "active" | "inactive";
  order?: number;
}
