import { ObjectId } from "mongodb";
import { getDb } from "@/core/lib/db";
import type {
  TopBarLink,
  TopBarDocument,
  TopBarLinkCreateInput,
  TopBarLinkUpdateInput,
  TopBarContact,
  TopBarContactDocument,
  TopBarContactUpdateInput,
} from "@/types/topbar";

const COLLECTION_LINKS = "topbar_links";
const COLLECTION_CONTACT = "topbar_contact";

function mapDocument(doc: TopBarDocument): TopBarLink {
  return {
    id: doc._id!.toHexString(),
    label: doc.label,
    href: doc.href,
    order: doc.order,
    status: doc.status,
    type: doc.type,
    dropdownItems: doc.dropdownItems,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function mapContactDocument(doc: TopBarContactDocument): TopBarContact {
  return {
    id: doc._id!.toHexString(),
    phone: doc.phone,
    phoneDisplay: doc.phoneDisplay,
    email: doc.email,
    facebookUrl: doc.facebookUrl,
    instagramUrl: doc.instagramUrl,
    showLanguageSwitcher: doc.showLanguageSwitcher ?? true,
    updatedAt: doc.updatedAt,
  };
}

// Links Management
export async function listTopBarLinks(): Promise<TopBarLink[]> {
  const db = await getDb();
  const docs = await db
    .collection<TopBarDocument>(COLLECTION_LINKS)
    .find({ status: "active" })
    .sort({ order: 1 })
    .toArray();
  return docs.map(mapDocument);
}

export async function listAllTopBarLinks(): Promise<TopBarLink[]> {
  const db = await getDb();
  const docs = await db
    .collection<TopBarDocument>(COLLECTION_LINKS)
    .find({})
    .sort({ order: 1 })
    .toArray();
  return docs.map(mapDocument);
}

export async function getTopBarLinkById(id: string): Promise<TopBarLink | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<TopBarDocument>(COLLECTION_LINKS)
    .findOne({ _id: new ObjectId(id) });
  return doc ? mapDocument(doc) : null;
}

export async function createTopBarLink(input: TopBarLinkCreateInput): Promise<TopBarLink> {
  const db = await getDb();
  const now = new Date();
  const result = await db.collection<Omit<TopBarDocument, "_id">>(COLLECTION_LINKS).insertOne({
    label: input.label,
    href: input.href,
    order: input.order,
    status: input.status,
    type: input.type,
    dropdownItems: input.dropdownItems,
    createdAt: now,
    updatedAt: now,
  } as any);
  const doc = await db
    .collection<TopBarDocument>(COLLECTION_LINKS)
    .findOne({ _id: result.insertedId });
  if (!doc) throw new Error("Failed to create topbar link");
  return mapDocument(doc);
}

export async function updateTopBarLink(
  id: string,
  input: TopBarLinkUpdateInput
): Promise<TopBarLink | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const result = await db.collection<TopBarDocument>(COLLECTION_LINKS).findOneAndUpdate(
    { _id: new ObjectId(id) },
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

export async function deleteTopBarLink(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<TopBarDocument>(COLLECTION_LINKS)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

// Contact Information Management
export async function getTopBarContact(): Promise<TopBarContact | null> {
  const db = await getDb();
  const doc = await db
    .collection<TopBarContactDocument>(COLLECTION_CONTACT)
    .findOne({});
  
  if (!doc) {
    // Create default contact info
    const now = new Date();
    const defaultContact = {
      phone: "061544761",
      phoneDisplay: "(061) 544761, 570124",
      email: "info@pcm.edu.np",
      facebookUrl: "https://www.facebook.com/239069093193587",
      instagramUrl: "https://www.instagram.com",
      showLanguageSwitcher: true,
      updatedAt: now,
    };
    
    const result = await db.collection<Omit<TopBarContactDocument, "_id">>(COLLECTION_CONTACT).insertOne(defaultContact as any);
    const newDoc = await db
      .collection<TopBarContactDocument>(COLLECTION_CONTACT)
      .findOne({ _id: result.insertedId });
    
    return newDoc ? mapContactDocument(newDoc) : null;
  }
  
  return mapContactDocument(doc);
}

export async function updateTopBarContact(input: TopBarContactUpdateInput): Promise<TopBarContact | null> {
  const db = await getDb();
  
  // Ensure at least one contact exists
  const existing = await getTopBarContact();
  if (!existing) {
    throw new Error("Contact info not found");
  }
  
  const result = await db.collection<TopBarContactDocument>(COLLECTION_CONTACT).findOneAndUpdate(
    { _id: new ObjectId(existing.id) },
    {
      $set: {
        ...input,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );
  
  return result ? mapContactDocument(result) : null;
}
