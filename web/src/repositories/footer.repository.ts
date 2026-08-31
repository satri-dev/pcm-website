import { ObjectId } from "mongodb";
import { getDb } from "@/core/lib/db";
import type {
  FooterSettings,
  FooterSettingsDocument,
  FooterSettingsUpdateInput,
  FooterLink,
  FooterLinkDocument,
  FooterLinkCreateInput,
  FooterLinkUpdateInput,
} from "@/types/footer";

const COLLECTION = "footer_settings";
const COLLECTION_LINKS = "footer_links";

function mapDocument(doc: FooterSettingsDocument): FooterSettings {
  return {
    id: doc._id!.toHexString(),
    logoUrl: doc.logoUrl,
    tagline: doc.tagline,
    address: doc.address,
    phone: doc.phone,
    email: doc.email,
    mapUrl: doc.mapUrl,
    facebookUrl: doc.facebookUrl,
    instagramUrl: doc.instagramUrl,
    linkedinUrl: doc.linkedinUrl,
    whatsappNumber: doc.whatsappNumber,
    weekdaysHours: doc.weekdaysHours,
    saturdayHours: doc.saturdayHours,
    affiliationText: doc.affiliationText,
    affiliationBadge: doc.affiliationBadge,
    newsletterTitle: doc.newsletterTitle,
    newsletterDescription: doc.newsletterDescription,
    copyrightText: doc.copyrightText,
    developerName: doc.developerName,
    developerUrl: doc.developerUrl,
    updatedAt: doc.updatedAt,
  };
}

export async function getFooterSettings(): Promise<FooterSettings | null> {
  const db = await getDb();
  const doc = await db
    .collection<FooterSettingsDocument>(COLLECTION)
    .findOne({});
  
  if (!doc) {
    // Create default settings
    const now = new Date();
    const defaultSettings = {
      logoUrl: "/images/logo-pcm.png",
      tagline: "Enter to Learn — Go Forth to Serve. Affordable, quality management & IT education in the heart of Pokhara since 2002.",
      address: "Gyan Marg, Nadipur, Pokhara-2, Kaski, Nepal",
      phone: "(061) 544761, 570124",
      email: "info@pcm.edu.np",
      mapUrl: "https://maps.google.com/?q=Pokhara+College+of+Management+Nadipur",
      facebookUrl: "https://www.facebook.com/239069093193587",
      instagramUrl: "https://www.instagram.com/",
      linkedinUrl: "https://www.linkedin.com/",
      whatsappNumber: "97761544761",
      weekdaysHours: "6:00 AM – 4:00 PM",
      saturdayHours: "Closed",
      affiliationText: "Affiliated to Pokhara University",
      affiliationBadge: "PU",
      newsletterTitle: "Stay in the Loop",
      newsletterDescription: "Monthly highlights — events, scholarships and results. No spam, unsubscribe anytime.",
      copyrightText: "Pokhara College of Management. All rights reserved.",
      developerName: "SATRI (satritech.com)",
      developerUrl: "https://satritech.com",
      updatedAt: now,
    };
    
    const result = await db.collection<Omit<FooterSettingsDocument, "_id">>(COLLECTION).insertOne(defaultSettings as any);
    const newDoc = await db
      .collection<FooterSettingsDocument>(COLLECTION)
      .findOne({ _id: result.insertedId });
    
    return newDoc ? mapDocument(newDoc) : null;
  }
  
  return mapDocument(doc);
}

export async function updateFooterSettings(input: FooterSettingsUpdateInput): Promise<FooterSettings | null> {
  const db = await getDb();
  
  // Ensure at least one document exists
  const existing = await getFooterSettings();
  if (!existing) {
    throw new Error("Footer settings not found");
  }
  
  const result = await db.collection<FooterSettingsDocument>(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(existing.id) },
    {
      $set: {
        ...input,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );
  
  return result ? mapDocument(result) : null;
}


// Footer Links Management
function mapLinkDocument(doc: FooterLinkDocument): FooterLink {
  return {
    id: doc._id!.toHexString(),
    title: doc.title,
    links: doc.links,
    order: doc.order,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function listFooterLinks(): Promise<FooterLink[]> {
  const db = await getDb();
  const docs = await db
    .collection<FooterLinkDocument>(COLLECTION_LINKS)
    .find({ status: "active" })
    .sort({ order: 1 })
    .toArray();
  return docs.map(mapLinkDocument);
}

export async function listAllFooterLinks(): Promise<FooterLink[]> {
  const db = await getDb();
  const docs = await db
    .collection<FooterLinkDocument>(COLLECTION_LINKS)
    .find({})
    .sort({ order: 1 })
    .toArray();
  return docs.map(mapLinkDocument);
}

export async function getFooterLinkById(id: string): Promise<FooterLink | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<FooterLinkDocument>(COLLECTION_LINKS)
    .findOne({ _id: new ObjectId(id) });
  return doc ? mapLinkDocument(doc) : null;
}

export async function createFooterLink(input: FooterLinkCreateInput): Promise<FooterLink> {
  const db = await getDb();
  const now = new Date();
  const result = await db.collection<Omit<FooterLinkDocument, "_id">>(COLLECTION_LINKS).insertOne({
    title: input.title,
    links: input.links,
    order: input.order,
    status: input.status,
    createdAt: now,
    updatedAt: now,
  } as any);
  const doc = await db
    .collection<FooterLinkDocument>(COLLECTION_LINKS)
    .findOne({ _id: result.insertedId });
  if (!doc) throw new Error("Failed to create footer link");
  return mapLinkDocument(doc);
}

export async function updateFooterLink(
  id: string,
  input: FooterLinkUpdateInput
): Promise<FooterLink | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const result = await db.collection<FooterLinkDocument>(COLLECTION_LINKS).findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...input,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );
  return result ? mapLinkDocument(result) : null;
}

export async function deleteFooterLink(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<FooterLinkDocument>(COLLECTION_LINKS)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
