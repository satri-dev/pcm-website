// src/repositories/survey-responses.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import { getSurveyBySlug } from "./surveys.repository";
import {
  SurveyResponse,
  SurveyResponseDocument,
  SurveyResponseGroup,
  SurveyAnswerValue,
  SURVEY_RESPONSES_COLLECTION,
} from "@/types/survey-response";

export async function createSurveyResponse(input: {
  surveySlug: string;
  respondent?: string;
  answers: Record<string, SurveyAnswerValue>;
}) {
  // Only accept responses for published, non-deleted surveys. Resolve the slug
  // to the real survey document so we can denormalize id + title for the admin
  // dashboard without an extra join on every read.
  const survey = await getSurveyBySlug(input.surveySlug);
  if (!survey || survey.status !== "published") return null;

  const db = await getDb();
  const doc: SurveyResponseDocument = {
    surveyId: new ObjectId(survey.id),
    surveySlug: survey.slug,
    surveyTitle: survey.title,
    respondent: input.respondent?.trim() || undefined,
    answers: input.answers || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await db
    .collection<SurveyResponseDocument>(SURVEY_RESPONSES_COLLECTION)
    .insertOne(doc);
  return { id: result.insertedId.toString(), surveyId: survey.id, surveySlug: survey.slug };
}

export interface ListSurveyResponsesOptions {
  surveySlug?: string;
  respondent?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
  includeDeleted?: boolean;
}

export async function listSurveyResponses(
  options: ListSurveyResponsesOptions = {}
) {
  const db = await getDb();
  const { surveySlug, respondent, search, page = 1, pageSize = 20, sort, includeDeleted } = options;

  const filter: Filter<SurveyResponseDocument> = {};
  if (!includeDeleted) filter.deletedAt = { $exists: false };
  if (surveySlug) filter.surveySlug = surveySlug;
  if (respondent) filter.respondent = { $regex: escapeRegex(respondent), $options: "i" };
  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ respondent: rx }, { surveyTitle: rx }];
  }

  const collection = db.collection<SurveyResponseDocument>(SURVEY_RESPONSES_COLLECTION);

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

export async function getSurveyResponseById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<SurveyResponseDocument>(SURVEY_RESPONSES_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function countSurveyResponses() {
  const db = await getDb();
  return db
    .collection<SurveyResponseDocument>(SURVEY_RESPONSES_COLLECTION)
    .countDocuments({ deletedAt: { $exists: false } });
}

// Group responses survey-wise for the admin overview. Titles/categories are
// resolved against the surveys collection so legacy rows without a
// denormalized title still display correctly.
export async function listSurveyResponseGroups(options: {
  page?: number;
  pageSize?: number;
} = {}) {
  const db = await getDb();
  const { page = 1, pageSize = 20 } = options;
  const collection = db.collection<SurveyResponseDocument>(SURVEY_RESPONSES_COLLECTION);

  const [groupDocs, totalAgg] = await Promise.all([
    collection
      .aggregate<GroupRow>([
        { $match: { deletedAt: { $exists: false } } },
        {
          $group: {
            _id: { $ifNull: ["$surveySlug", { $toString: "$surveyId" }] },
            count: { $sum: 1 },
            lastResponseAt: { $max: "$createdAt" },
            avgAnswers: {
              $avg: {
                $size: { $objectToArray: { $ifNull: ["$answers", {}] } },
              },
            },
            storedTitle: { $max: { $ifNull: ["$surveyTitle", ""] } },
          },
        },
        { $sort: { lastResponseAt: -1 } },
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
      ])
      .toArray(),
    collection
      .aggregate<{ total: number }>([
        { $match: { deletedAt: { $exists: false } } },
        {
          $group: {
            _id: { $ifNull: ["$surveySlug", { $toString: "$surveyId" }] },
          },
        },
        { $count: "total" },
      ])
      .toArray(),
  ]);

  const slugs = groupDocs.map((g) => g._id).filter(Boolean);
  const surveyCol = db.collection<{
    slug: string;
    title: string;
    icon?: string;
    category?: string;
  }>("surveys");
  const surveyDocs = slugs.length
    ? await surveyCol.find({ slug: { $in: slugs } }).toArray()
    : [];
  const meta = new Map(surveyDocs.map((s) => [s.slug, s]));

  const items: SurveyResponseGroup[] = groupDocs.map((g) => {
    const s = meta.get(g._id);
    return {
      surveyId: s?.slug ?? g._id,
      surveySlug: g._id,
      surveyTitle: g.storedTitle || s?.title || g._id,
      icon: s?.icon || "📋",
      category: s?.category || "",
      count: g.count,
      answeredQuestions: Math.round(g.avgAnswers || 0),
      lastResponseAt: g.lastResponseAt?.toISOString(),
    };
  });

  const total = Number(totalAgg[0]?.total ?? 0);
  return {
    items,
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function deleteSurveyResponse(id: string, deletedBy?: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<SurveyResponseDocument>(SURVEY_RESPONSES_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date(), deletedBy, updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function restoreSurveyResponse(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<SurveyResponseDocument>(SURVEY_RESPONSES_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $unset: { deletedAt: "", deletedBy: "" }, $set: { updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function hardDeleteSurveyResponse(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<SurveyResponseDocument>(SURVEY_RESPONSES_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

function fromDocument(doc: SurveyResponseDocument): SurveyResponse {
  const legacySlug =
    typeof (doc as unknown as { surveyId?: unknown }).surveyId === "string"
      ? ((doc as unknown as { surveyId: string }).surveyId)
      : "";
  return {
    id: doc._id!.toString(),
    surveyId: doc.surveyId?.toString() ?? legacySlug,
    surveySlug: doc.surveySlug || legacySlug,
    surveyTitle: doc.surveyTitle ?? "",
    respondent: doc.respondent,
    answers: (doc.answers ?? {}) as Record<string, SurveyAnswerValue>,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? doc.createdAt ?? new Date()).toISOString(),
    deletedAt: doc.deletedAt?.toISOString(),
    deletedBy: doc.deletedBy,
  };
}

interface GroupRow {
  _id: string;
  count: number;
  lastResponseAt?: Date;
  avgAnswers: number;
  storedTitle: string;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

let indexesReady: Promise<void> | null = null;
export function ensureSurveyResponseIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<SurveyResponseDocument>(SURVEY_RESPONSES_COLLECTION);
      const wanted: IndexDescription[] = [
        // Serve the admin survey-wise grouping (filter non-deleted, sort by time).
        { key: { surveySlug: 1, createdAt: -1 }, name: "surveySlug_createdAt_desc" },
        // Serve per-survey lists: non-deleted + newest first.
        { key: { surveySlug: 1, deletedAt: 1, createdAt: -1 }, name: "surveySlug_deleted_created_desc" },
        // Serve the trash list.
        { key: { deletedAt: 1 }, name: "deletedAt" },
        // Survey-wise aggregations (safe when docs lack a deletedAt field).
        { key: { surveySlug: 1 }, name: "surveySlug" },
        // Fast un-filtered date ordering (counts / plain listing).
        { key: { createdAt: -1 }, name: "createdAt_desc" },
      ];

      try {
        const existing = await col.listIndexes().toArray();
        for (const idx of existing) {
          if (idx.name === "_id_") continue;
          const match = wanted.find((w) => w.name === idx.name);
          if (!match || JSON.stringify(match.key) !== JSON.stringify(idx.key)) {
            await col.dropIndex(idx.name).catch(() => {});
          }
        }
      } catch {
        // Collection may not exist yet; createIndexes will create it.
      }

      await col.createIndexes(wanted);
    })();
  }
  return indexesReady;
}
