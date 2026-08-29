// src/repositories/nav-menu.repository.ts
import { ObjectId, Filter, IndexDescription, UpdateFilter } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  NavMenuItem,
  NavMenuItemDocument,
  NavMenuCreateInput,
  NavMenuUpdateInput,
  NAV_MENU_COLLECTION,
} from "@/types/nav-menu";

function fromDocument(doc: NavMenuItemDocument): NavMenuItem {
  return {
    id: doc._id!.toString(),
    label: doc.label,
    type: doc.type,
    href: doc.href,
    children: doc.children ?? [],
    columns: doc.columns ?? [],
    order: doc.order,
    active: !!doc.active,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
    deletedAt: doc.deletedAt?.toISOString(),
    deletedBy: doc.deletedBy,
  };
}

function toDocument(
  input: NavMenuCreateInput,
  order: number
): Omit<NavMenuItemDocument, "_id"> {
  const now = new Date();
  return clean({
    label: input.label.trim(),
    type: input.type,
    href: input.href?.trim() || undefined,
    children: Array.isArray(input.children)
      ? input.children
          .filter((c) => c.label.trim() && c.href.trim())
          .map((c) => ({ label: c.label.trim(), href: c.href.trim() }))
      : [],
    columns: Array.isArray(input.columns)
      ? input.columns
          .filter((col) => col.label.trim())
          .map((col) => ({
            label: col.label.trim(),
            links: (col.links ?? [])
              .filter((l) => l.label.trim() && l.href.trim())
              .map((l) => ({ label: l.label.trim(), href: l.href.trim() })),
          }))
      : [],
    order,
    active: input.active !== false,
    createdAt: now,
    updatedAt: now,
  });
}

function clean<T extends Record<string, unknown>>(obj: T): T {
  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined) delete obj[key];
  }
  return obj;
}

export interface ListNavMenuOptions {
  includeDeleted?: boolean;
  search?: string;
}

export async function listNavMenu(options: ListNavMenuOptions = {}) {
  const db = await getDb();
  const { includeDeleted, search } = options;

  const filter: Filter<NavMenuItemDocument> = {};
  if (!includeDeleted) {
    filter.deletedAt = { $exists: false };
  }
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ label: rx }];
  }

  const docs = await db
    .collection<NavMenuItemDocument>(NAV_MENU_COLLECTION)
    .find(filter)
    .sort({ order: 1, createdAt: 1 })
    .toArray();

  return docs.map(fromDocument);
}

export async function getNavMenuById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<NavMenuItemDocument>(NAV_MENU_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function getNextNavMenuOrder() {
  const db = await getDb();
  const last = await db
    .collection<NavMenuItemDocument>(NAV_MENU_COLLECTION)
    .find({ deletedAt: { $exists: false } })
    .sort({ order: -1 })
    .limit(1)
    .toArray();
  return last.length > 0 ? (last[0].order ?? 0) + 10 : 10;
}

export async function createNavMenu(input: NavMenuCreateInput) {
  const db = await getDb();
  const order =
    input.order !== undefined ? input.order : await getNextNavMenuOrder();
  const doc = toDocument(input, order);
  const result = await db
    .collection<NavMenuItemDocument>(NAV_MENU_COLLECTION)
    .insertOne(doc as NavMenuItemDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateNavMenu(id: string, patch: NavMenuUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const unset: Record<string, "" | 1 | true> = {};
  const allowed: (keyof NavMenuCreateInput)[] = [
    "label",
    "type",
    "href",
    "children",
    "columns",
    "order",
    "active",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) {
      if (key === "href") {
        const href = patch.href?.trim();
        if (href) set[key] = href;
        else unset[key] = "";
      } else {
        set[key] = patch[key];
      }
    }
  }

  const update: UpdateFilter<NavMenuItemDocument> = { $set: set };
  if (Object.keys(unset).length) {
    update.$unset = unset as UpdateFilter<NavMenuItemDocument>["$unset"];
  }

  const doc = await db
    .collection<NavMenuItemDocument>(NAV_MENU_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      update,
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as NavMenuItemDocument) : null;
}

export async function deleteNavMenu(id: string, deletedBy?: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<NavMenuItemDocument>(NAV_MENU_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date(), deletedBy, updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function restoreNavMenu(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<NavMenuItemDocument>(NAV_MENU_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $unset: { deletedAt: "", deletedBy: "" }, $set: { updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function hardDeleteNavMenu(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<NavMenuItemDocument>(NAV_MENU_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function countActiveNavMenu() {
  const db = await getDb();
  return db
    .collection<NavMenuItemDocument>(NAV_MENU_COLLECTION)
    .countDocuments({ deletedAt: { $exists: false } });
}

// Default menu mirrors the menu the site shipped with before the navbar
// became DB-driven. Idempotent: only inserted when the collection has no
// live (non-deleted) documents.
export async function seedDefaultNavMenus() {
  const db = await getDb();
  const existing = await countActiveNavMenu();
  if (existing > 0) return false;

  const now = new Date();
  const defaults: Omit<NavMenuItemDocument, "_id">[] = [
    {
      label: "Home",
      type: "link",
      href: "/",
      children: [],
      columns: [],
      order: 10,
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      label: "About",
      type: "dropdown",
      href: "/about",
      children: [
        { label: "About PCM", href: "/about" },
        { label: "Words from our leaders", href: "/about/message" },
        { label: "Board of Directors", href: "/about/board" },
        { label: "Faculty & Staff", href: "/about/faculty" },
        { label: "Campus & Facilities", href: "/about/facility" },
        { label: "Campus Map", href: "/about/campus-map" },
      ],
      columns: [],
      order: 20,
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      label: "Programs",
      type: "dropdown",
      href: "/programs",
      children: [
        { label: "All Programs", href: "/programs" },
        { label: "BBA", href: "/programs/bba" },
        { label: "BBA-Finance", href: "/programs/bba-finance" },
        { label: "BCSIT", href: "/programs/bcsit" },
      ],
      columns: [],
      order: 30,
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      label: "News",
      type: "dropdown",
      href: "/news",
      children: [
        { label: "News", href: "/news" },
        { label: "Notices", href: "/notices" },
        { label: "Results", href: "/results" },
        { label: "Events", href: "/events" },
      ],
      columns: [],
      order: 40,
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      label: "Gallery",
      type: "link",
      href: "/gallery",
      children: [],
      columns: [],
      order: 50,
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      label: "Blogs",
      type: "dropdown",
      href: "/blogs",
      children: [
        { label: "Articles", href: "/blogs" },
        { label: "Student Blogs", href: "/blogs-student" },
      ],
      columns: [],
      order: 60,
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      label: "More",
      type: "mega",
      children: [],
      columns: [
        {
          label: "Community",
          links: [
            { label: "Clubs", href: "/clubs" },
            { label: "Alumni", href: "/alumni" },
            { label: "Testimonials", href: "/testimonials" },
            { label: "PCM Life", href: "/life" },
            { label: "Feedback", href: "/feedback" },
            { label: "Surveys", href: "/survey" },
          ],
        },
        {
          label: "Admission & Support",
          links: [
            { label: "Admission", href: "/admission" },
            { label: "Scholarships", href: "/scholarship" },
            { label: "Downloads", href: "/downloads" },
            { label: "FAQ", href: "/faq" },
          ],
        },
        {
          label: "Campus & Careers",
          links: [
            { label: "Campus & Facilities", href: "/about/facility" },
            { label: "Placements", href: "/placements" },
            { label: "Careers", href: "/career" },
            { label: "Virtual Tour", href: "/virtual-tour" },
          ],
        },
        {
          label: "Resources",
          links: [
            { label: "GPA Converter", href: "/gpa-converter" },
            { label: "NP-EN Converter", href: "/np-en-converter" },
            { label: "Campus Map", href: "/about/campus-map" },
            { label: "Login", href: "https://www.pcm.edu.np/login" },
          ],
        },
      ],
      order: 70,
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      label: "Contact",
      type: "link",
      href: "/contact",
      children: [],
      columns: [],
      order: 80,
      active: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db
    .collection<NavMenuItemDocument>(NAV_MENU_COLLECTION)
    .insertMany(defaults as NavMenuItemDocument[]);
  return true;
}

// Called lazily so indexes exist even if scripts/create-nav-menu-collection.js
// was never run. Also seeds the default navbar on first use.
let readyPromise: Promise<void> | null = null;
export function ensureNavMenusReady() {
  if (!readyPromise) {
    readyPromise = (async () => {
      await ensureNavMenusIndexes();
      await seedDefaultNavMenus();
    })();
  }
  return readyPromise;
}

let indexesReady: Promise<void> | null = null;
export function ensureNavMenusIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<NavMenuItemDocument>(NAV_MENU_COLLECTION);
      const wanted: IndexDescription[] = [
        { key: { order: 1 }, name: "order" },
        { key: { active: 1 }, name: "active" },
      ];

      const existing = await col.listIndexes().toArray();
      for (const idx of existing) {
        if (idx.name === "_id_") continue;
        const match = wanted.find((w) => w.name === idx.name);
        if (!match || JSON.stringify(match.key) !== JSON.stringify(idx.key)) {
          await col.dropIndex(idx.name).catch(() => {});
        }
      }

      await col.createIndexes(wanted);
    })();
  }
  return indexesReady;
}