// src/repositories/homepage.repository.ts
import { IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  HomepageData,
  HomepageDocument,
  HomepageUpdateInput,
  HOMEPAGE_COLLECTION,
  DEFAULT_HOMEPAGE_DATA,
} from "@/types/homepage";

const FALLBACK_IMAGE = "/images/hero-1.jpg";

function isValidUrl(s: string | undefined): boolean {
  return !!s && (s.startsWith("/") || s.startsWith("http"));
}

function sanitizeUrl(s: string | undefined, fallback = FALLBACK_IMAGE): string {
  return isValidUrl(s) ? s! : fallback;
}

function fromDocument(doc: HomepageDocument): HomepageData {
  return {
    id: doc._id!.toString(),
    heroSlides: (doc.heroSlides ?? []).map((s) => ({
      ...s,
      image: sanitizeUrl(s.image),
      primaryCta: { ...s.primaryCta, href: isValidUrl(s.primaryCta?.href) ? s.primaryCta.href : "/" },
      secondaryCta: { ...s.secondaryCta, href: isValidUrl(s.secondaryCta?.href) ? s.secondaryCta.href : "/" },
    })),
    welcomeText: { ...DEFAULT_HOMEPAGE_DATA.welcomeText, ...doc.welcomeText },
    welcomeStats: doc.welcomeStats,
    whyChooseText: { ...DEFAULT_HOMEPAGE_DATA.whyChooseText, ...doc.whyChooseText },
    whyChooseReasons: doc.whyChooseReasons,
    programsText: { ...DEFAULT_HOMEPAGE_DATA.programsText, ...doc.programsText },
    facilitiesText: { ...DEFAULT_HOMEPAGE_DATA.facilitiesText, ...doc.facilitiesText },
    eventsText: { ...DEFAULT_HOMEPAGE_DATA.eventsText, ...doc.eventsText },
    galleryText: { ...DEFAULT_HOMEPAGE_DATA.galleryText, ...doc.galleryText },
    blogsText: { ...DEFAULT_HOMEPAGE_DATA.blogsText, ...doc.blogsText },
    newsText: { ...DEFAULT_HOMEPAGE_DATA.newsText, ...doc.newsText },
    testimonialsText: { ...DEFAULT_HOMEPAGE_DATA.testimonialsText, ...doc.testimonialsText },
    testimonials: (doc.testimonials ?? []).map((t) => ({
      ...t,
      photo: sanitizeUrl(t.photo),
    })),
    admission: {
      ...DEFAULT_HOMEPAGE_DATA.admission,
      ...doc.admission,
      posterImage: sanitizeUrl(doc.admission?.posterImage),
    },
    cta: doc.cta,
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
  };
}

/**
 * Return the single homepage document, creating it from defaults if it
 * does not yet exist.  The homepage collection stores exactly one row.
 */
export async function getHomepage(): Promise<HomepageData> {
  const db = await getDb();
  const col = db.collection<HomepageDocument>(HOMEPAGE_COLLECTION);
  let doc = await col.findOne({});
  if (!doc) {
    const now = new Date();
    const insert = { ...DEFAULT_HOMEPAGE_DATA, createdAt: now, updatedAt: now };
    const result = await col.insertOne(insert as HomepageDocument);
    doc = { ...insert, _id: result.insertedId };
  }
  return fromDocument(doc);
}

/** Replace sections of the homepage document. */
export async function updateHomepage(
  patch: HomepageUpdateInput
): Promise<HomepageData> {
  const db = await getDb();
  const col = db.collection<HomepageDocument>(HOMEPAGE_COLLECTION);

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof HomepageUpdateInput)[] = [
    "heroSlides",
    "welcomeText",
    "welcomeStats",
    "whyChooseText",
    "whyChooseReasons",
    "programsText",
    "facilitiesText",
    "eventsText",
    "galleryText",
    "blogsText",
    "newsText",
    "testimonialsText",
    "testimonials",
    "admission",
    "cta",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) {
      set[key] = patch[key]; // No limit applied to heroSlides
    }
  }

  // Ensure document exists
  const existing = await col.findOne({});
  if (!existing) {
    const now = new Date();
    await col.insertOne({
      ...DEFAULT_HOMEPAGE_DATA,
      ...set,
      createdAt: now,
      updatedAt: now,
    } as HomepageDocument);
  } else {
    await col.updateOne({ _id: existing._id }, { $set: set });
  }

  return getHomepage();
}

let indexesReady: Promise<void> | null = null;
export function ensureHomepageIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      try {
        const db = await getDb();
        const col = db.collection<HomepageDocument>(HOMEPAGE_COLLECTION);
        const wanted: IndexDescription[] = [];

        const existing = await col.listIndexes().toArray();
        for (const idx of existing) {
          if (idx.name === "_id_") continue;
          const match = wanted.find((w) => w.name === idx.name);
          if (!match || JSON.stringify(match.key) !== JSON.stringify(idx.key)) {
            await col.dropIndex(idx.name).catch(() => {});
          }
        }
        if (wanted.length > 0) {
          await col.createIndexes(wanted);
        }
      } catch {
        // Collection may not exist yet; indexes will be created on first insert.
      }
    })();
  }
  return indexesReady;
}
