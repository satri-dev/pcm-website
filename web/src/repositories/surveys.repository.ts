// src/repositories/surveys.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Survey,
  SurveyDocument,
  SurveyCreateInput,
  SurveyUpdateInput,
  SURVEY_COLLECTION,
} from "@/types/surveys";

function countQuestions(questions: SurveyCreateInput["questions"]): number {
  if (!questions) return 0;
  return questions.reduce((acc, q) => {
    const self = q.label ? 1 : 0;
    return acc + self + countQuestions(q.children ?? []);
  }, 0);
}

function calculateTimeToRead(questions: SurveyCreateInput["questions"]): number {
  // ~30 seconds per question (including nested sub-fields), minimum 1 minute
  return Math.max(1, Math.ceil((countQuestions(questions) * 30) / 60));
}

function fromDocument(doc: SurveyDocument): Survey {
  return {
    id: doc._id!.toString(),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    content: doc.content,
    category: doc.category,
    icon: doc.icon,
    status: doc.status,
    featured: !!doc.featured,
    timeToRead: doc.timeToRead ?? 1,
    endsOn: doc.endsOn?.toISOString().slice(0, 10),
    questions: doc.questions ?? [],
    tags: doc.tags ?? [],
    seo: doc.seo,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
    deletedAt: doc.deletedAt?.toISOString(),
    deletedBy: doc.deletedBy,
  };
}

function toDocument(input: SurveyCreateInput): Omit<SurveyDocument, "_id"> {
  const now = new Date();
  const endsOn = input.endsOn ? new Date(input.endsOn) : undefined;
  if (input.endsOn && endsOn && isNaN(endsOn.getTime())) {
    throw new Error("Invalid endsOn date");
  }
  return clean({
    title: input.title.trim(),
    slug: input.slug.trim(),
    excerpt: input.excerpt,
    content: input.content,
    category: input.category,
    icon: input.icon,
    status: input.status,
    featured: !!input.featured,
    timeToRead: input.timeToRead ?? calculateTimeToRead(input.questions),
    endsOn: endsOn && !isNaN(endsOn.getTime()) ? endsOn : undefined,
    questions: input.questions ?? [],
    tags: Array.isArray(input.tags) ? input.tags : undefined,
    seo: input.seo,
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

export interface ListSurveysOptions {
  status?: Survey["status"];
  category?: Survey["category"];
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
  includeDeleted?: boolean;
}

export async function listSurveys(options: ListSurveysOptions = {}) {
  const db = await getDb();
  const { status, category, search, page = 1, pageSize = 8, sort, includeDeleted } = options;

  const filter: Filter<SurveyDocument> = {};
  if (!includeDeleted) {
    filter.deletedAt = { $exists: false };
  }
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { excerpt: rx }];
  }

  const collection = db.collection<SurveyDocument>(SURVEY_COLLECTION);

  const [total, docs] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter)
      .sort(sort ?? { createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
  ]);

  return {
    items: docs.map(fromDocument),
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getSurveyById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<SurveyDocument>(SURVEY_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function getPublishedSurveyBySlug(slug: string) {
  const db = await getDb();
  const doc = await db
    .collection<SurveyDocument>(SURVEY_COLLECTION)
    .findOne({ slug, status: "published", deletedAt: { $exists: false } });
  return doc ? fromDocument(doc) : null;
}

export async function createSurvey(input: SurveyCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<SurveyDocument>(SURVEY_COLLECTION)
    .insertOne(doc as SurveyDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateSurvey(id: string, patch: SurveyUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof SurveyCreateInput)[] = [
    "title",
    "slug",
    "excerpt",
    "content",
    "category",
    "icon",
    "status",
    "featured",
    "endsOn",
    "questions",
    "tags",
    "seo",
    "timeToRead",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }
  if (patch.endsOn !== undefined) {
    const d = new Date(patch.endsOn);
    if (patch.endsOn && isNaN(d.getTime())) throw new Error("Invalid endsOn date");
    set.endsOn = patch.endsOn ? d : null;
  }
  // Auto-recalculate timeToRead if questions changed
  if (patch.questions !== undefined) {
    set.timeToRead = calculateTimeToRead(patch.questions);
  }

  const doc = await db
    .collection<SurveyDocument>(SURVEY_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as SurveyDocument) : null;
}

export async function deleteSurvey(id: string, deletedBy?: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<SurveyDocument>(SURVEY_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date(), deletedBy, updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function restoreSurvey(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<SurveyDocument>(SURVEY_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $unset: { deletedAt: "", deletedBy: "" }, $set: { updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function hardDeleteSurvey(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<SurveyDocument>(SURVEY_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function listTrashedSurveys(options: { page?: number; pageSize?: number; search?: string } = {}) {
  const db = await getDb();
  const { page = 1, pageSize = 20, search } = options;

  const filter: Filter<SurveyDocument> = { deletedAt: { $exists: true } };
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { excerpt: rx }];
  }

  const collection = db.collection<SurveyDocument>(SURVEY_COLLECTION);
  const [total, docs] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter)
      .sort({ deletedAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
  ]);

  return {
    items: docs.map(fromDocument),
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function autoPurgeTrashedSurveys() {
  const db = await getDb();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const result = await db
    .collection<SurveyDocument>(SURVEY_COLLECTION)
    .deleteMany({ deletedAt: { $exists: true, $lt: thirtyDaysAgo } });
  return result.deletedCount;
}

// Called lazily so indexes exist even if scripts/create-surveys-collection.js
// was never run. Unique-slug violations surface on insert.
let indexesReady: Promise<void> | null = null;
export function ensureSurveyIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<SurveyDocument>(SURVEY_COLLECTION);
      const wanted: IndexDescription[] = [
        { key: { slug: 1 }, name: "uniq_slug", unique: true },
        {
          key: { status: 1, createdAt: -1 },
          name: "status_created_desc",
        },
        { key: { category: 1 }, name: "category" },
        { key: { featured: 1 }, name: "featured" },
        { key: { title: "text", excerpt: "text" }, name: "text_search" },
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