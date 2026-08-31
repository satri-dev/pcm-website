import type { ObjectId } from "mongodb";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  subscribedAt: Date;
  unsubscribedAt?: Date;
  source?: string; // e.g., "footer", "homepage", etc.
}

export interface NewsletterSubscriberDocument extends Omit<NewsletterSubscriber, "id"> {
  _id: ObjectId;
}

export interface NewsletterSubscribeInput {
  email: string;
  source?: string;
}

export interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribed: number;
  recentSubscribers: number; // Last 30 days
}
