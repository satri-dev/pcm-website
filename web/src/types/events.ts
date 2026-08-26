// src/types/events.ts
// Canonical schema for the "events" collection

export type EventType = "Workshop" | "Seminar" | "Festival" | "Tour" | "Sports";
export type EventStatus = "published" | "draft";

export const EVENT_TYPES: readonly EventType[] = [
  "Workshop",
  "Seminar",
  "Festival",
  "Tour",
  "Sports",
];

export const EVENT_STATUSES: readonly EventStatus[] = ["published", "draft"];

export const EVENT_COLLECTION = "events";

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  type: EventType;
  date: string;
  location: string;
  seats: number;
  description: string;
  image?: string;
  status: EventStatus;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventDocument {
  _id?: import("mongodb").ObjectId;
  title: string;
  slug: string;
  type: EventType;
  date: Date;
  location: string;
  seats: number;
  description: string;
  image?: string;
  status: EventStatus;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventCreateInput {
  title: string;
  slug: string;
  type: EventType;
  date: string;
  location: string;
  seats: number;
  description: string;
  image?: string;
  status: EventStatus;
  views?: number;
}

export type Event = EventItem;
export type EventUpdateInput = Partial<EventCreateInput>;
