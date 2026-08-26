import { ObjectId } from "mongodb";

export type ChatbotChannel =
  | "Admission"
  | "Program"
  | "Support"
  | "Fee"
  | "General";

export const CHATBOT_CHANNELS: readonly ChatbotChannel[] = [
  "Admission",
  "Program",
  "Fee",
  "Support",
  "General",
];

export const CHATBOT_COLLECTION = "chatbot_entries";

export interface ChatbotEntry {
  id: string;
  channel: ChatbotChannel;
  question: string;
  keywords: string[];
  answer: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatbotDocument {
  _id?: ObjectId;
  channel: ChatbotChannel;
  question: string;
  keywords: string[];
  answer: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatbotCreateInput {
  channel: ChatbotChannel;
  question: string;
  keywords: string[];
  answer: string;
  active: boolean;
}

export type ChatbotUpdateInput = Partial<ChatbotCreateInput>;
