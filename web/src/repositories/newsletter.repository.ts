import "server-only";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type {
  NewsletterSubscriber,
  NewsletterSubscriberDocument,
  NewsletterSubscribeInput,
  NewsletterStats,
} from "@/types/newsletter";

const COLLECTION = "newsletter_subscribers";

function mapDocument(doc: NewsletterSubscriberDocument): NewsletterSubscriber {
  return {
    id: doc._id.toString(),
    email: doc.email,
    status: doc.status,
    subscribedAt: doc.subscribedAt,
    unsubscribedAt: doc.unsubscribedAt,
    source: doc.source,
  };
}

/**
 * Subscribe a new email to the newsletter
 */
export async function subscribeToNewsletter(
  input: NewsletterSubscribeInput
): Promise<NewsletterSubscriber> {
  const db = await getDb();
  const collection = db.collection<NewsletterSubscriberDocument>(COLLECTION);

  // Check if email already exists
  const existing = await collection.findOne({ email: input.email.toLowerCase() });

  if (existing) {
    // If previously unsubscribed, reactivate
    if (existing.status === "unsubscribed") {
      const updated = await collection.findOneAndUpdate(
        { email: input.email.toLowerCase() },
        {
          $set: {
            status: "active",
            subscribedAt: new Date(),
          },
          $unset: { unsubscribedAt: "" },
        },
        { returnDocument: "after" }
      );
      if (!updated) throw new Error("Failed to resubscribe");
      return mapDocument(updated);
    }
    // Already subscribed
    return mapDocument(existing);
  }

  // New subscription
  const doc: Omit<NewsletterSubscriberDocument, "_id"> = {
    email: input.email.toLowerCase(),
    status: "active",
    subscribedAt: new Date(),
    source: input.source || "footer",
  };

  const result = await collection.insertOne(doc as NewsletterSubscriberDocument);
  const inserted = await collection.findOne({ _id: result.insertedId });
  if (!inserted) throw new Error("Failed to create subscription");

  return mapDocument(inserted);
}

/**
 * Unsubscribe an email from the newsletter
 */
export async function unsubscribeFromNewsletter(email: string): Promise<boolean> {
  const db = await getDb();
  const collection = db.collection<NewsletterSubscriberDocument>(COLLECTION);

  const result = await collection.updateOne(
    { email: email.toLowerCase(), status: "active" },
    {
      $set: {
        status: "unsubscribed",
        unsubscribedAt: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

/**
 * Get all newsletter subscribers (admin)
 */
export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
  const db = await getDb();
  const collection = db.collection<NewsletterSubscriberDocument>(COLLECTION);

  const docs = await collection.find({}).sort({ subscribedAt: -1 }).toArray();
  return docs.map(mapDocument);
}

/**
 * Get active subscribers only
 */
export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  const db = await getDb();
  const collection = db.collection<NewsletterSubscriberDocument>(COLLECTION);

  const docs = await collection
    .find({ status: "active" })
    .sort({ subscribedAt: -1 })
    .toArray();
  return docs.map(mapDocument);
}

/**
 * Get newsletter statistics
 */
export async function getNewsletterStats(): Promise<NewsletterStats> {
  const db = await getDb();
  const collection = db.collection<NewsletterSubscriberDocument>(COLLECTION);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [total, active, unsubscribed, recent] = await Promise.all([
    collection.countDocuments({}),
    collection.countDocuments({ status: "active" }),
    collection.countDocuments({ status: "unsubscribed" }),
    collection.countDocuments({
      subscribedAt: { $gte: thirtyDaysAgo },
      status: "active",
    }),
  ]);

  return {
    totalSubscribers: total,
    activeSubscribers: active,
    unsubscribed,
    recentSubscribers: recent,
  };
}

/**
 * Delete a subscriber by ID (admin)
 */
export async function deleteSubscriber(id: string): Promise<boolean> {
  const db = await getDb();
  const collection = db.collection<NewsletterSubscriberDocument>(COLLECTION);

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

/**
 * Check if an email is subscribed
 */
export async function isEmailSubscribed(email: string): Promise<boolean> {
  const db = await getDb();
  const collection = db.collection<NewsletterSubscriberDocument>(COLLECTION);

  const subscriber = await collection.findOne({
    email: email.toLowerCase(),
    status: "active",
  });

  return !!subscriber;
}
