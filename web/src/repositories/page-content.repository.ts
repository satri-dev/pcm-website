// src/repositories/page-content.repository.ts
import { getDb } from "@/core/lib/db";
import {
  PageContent,
  PageContentDocument,
  PAGE_CONTENT_COLLECTION,
} from "@/types/page-content";

function fromDocument(doc: PageContentDocument): PageContent {
  return {
    id: doc._id!.toString(),
    slug: doc.slug,
    content: doc.content ?? {},
    // Legacy flat exposure for about/clubs "about/*" pages where the fields
    // live at the document root rather than nested under "content".
    label: doc.label ?? doc.content?.label,
    hero: doc.hero ?? doc.content?.hero,
    sections: doc.sections ?? doc.content?.sections,
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: doc.updatedAt
      ? new Date(doc.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}

export async function getPageContentBySlug(slug: string): Promise<PageContent | null> {
  const db = await getDb();
  const doc = await db
    .collection<PageContentDocument>(PAGE_CONTENT_COLLECTION)
    .findOne({ slug });
  
  return doc ? fromDocument(doc) : null;
}

export async function upsertPageContent(
  slug: string,
  content: Record<string, unknown>
): Promise<PageContent> {
  const db = await getDb();
  const now = new Date();

  // Generic CMS pages (about, clubs, "about/*") store label/hero/sections
  // flat at the document root. Program pages store their payload nested
  // under "content". Peek at the keys to write the right shape.
  const isFlat = "label" in content || "sections" in content;

  const doc = await db
    .collection<PageContentDocument>(PAGE_CONTENT_COLLECTION)
    .findOneAndUpdate(
      { slug },
      {
        $set: isFlat
          ? { ...(content as object), updatedAt: now }
          : { content, updatedAt: now },
        $setOnInsert: {
          slug,
          createdAt: now,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

  return fromDocument(doc as PageContentDocument);
}

export async function deletePageContent(slug: string): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection<PageContentDocument>(PAGE_CONTENT_COLLECTION)
    .deleteOne({ slug });
  return (result.deletedCount ?? 0) > 0;
}

// Default copy mirrors what the public pages shipped with before the
// descriptions became DB-driven. Idempotent: only inserted when a slug has
// no document yet, so admin edits are never overwritten.
const DEFAULT_CONTENT: Omit<PageContentDocument, "_id" | "updatedAt">[] = [
  {
    slug: "about",
    label: "About",
    hero: {
      title: "About Pokhara College of Management",
      subtitle:
        "Since 2002, a home for confident, creative and adaptive graduates in the heart of Pokhara.",
    },
    sections: [
      {
        key: "who-we-are",
        eyebrow: "Who we are",
        title: "Quality management education, made affordable",
        paragraphs: [
          "Pokhara College of Management (PCM), affiliated to Pokhara University, was established in 2002 with an unwavering dedication to developing well-educated, confident, creative and adaptive graduates able to make an impact on an organisation's strategic capability and competitive advantage.",
          "The PCM team firmly believes that quality management education is the need of the hour, as the world transforms into a common business arena. A business leader must understand the global rules to excel in local fields — and that spirit has guided us from humble beginnings to a college trusted by guardians, students and society alike.",
        ],
      },
      {
        key: "why-pcm",
        eyebrow: "Why study at PCM?",
        title: "A balanced approach to management",
        paragraphs: [
          "The last two decades of change in information technology have brought unprecedented shifts to the business world. Markets are opening, competition is intensifying, and the horizon of management education is ever-evolving.",
          "Through it all, the time-tested values of management remain a guide. Our programs adopt a well-balanced approach — inculcating a strong theoretical concept of management alongside an intense realisation of its practical application in real life.",
        ],
      },
      {
        key: "values",
        eyebrow: "Vision, Mission & Values",
        title: "What we stand for",
        paragraphs: [
          "To identify, develop and unveil the potential of future business leaders who define their own role and boundaries — and grasp the opportunities of a dynamic new world.",
          "A value-based organisation promoting discipline, sincerity, hard work and innovation as individual values, and respect, professionalism, fairness, transparency and team spirit as organisational values.",
          "To offer highly competitive, professionally oriented education — equipping students with advanced conceptual, analytical and quantitative techniques for decision-making.",
        ],
      },
      { key: "difference", eyebrow: "The PCM difference", title: "What makes us different" },
      { key: "stats", eyebrow: "By the numbers", title: "A legacy measured in outcomes" },
      {
        key: "achievers",
        eyebrow: "Voices of PCM",
        title: "What our achievers say",
        subtitle:
          "Graduates on the Dean's List reflect on their four-year journey — the mentorship, the friendships, and the confidence they carry forward.",
      },
      {
        key: "cta",
        eyebrow: "Enter to Learn — Go Forth to Serve",
        title: "A step towards your future",
        paragraphs: [
          "Applications for the 2083 intake are open across all three programs. Take the first step today.",
        ],
      },
    ],
  },
  {
    slug: "about/board",
    label: "Board of Directors",
    hero: {
      title: "Board of Directors",
      subtitle:
        "The people steering PCM — guiding vision, governance and growth since 2002.",
    },
    sections: [
      {
        key: "intro",
        eyebrow: "Governance",
        title: "Our Board of Directors",
        subtitle:
          "A committed leadership team that keeps PCM rooted in quality, integrity and service.",
      },
      {
        key: "promise",
        eyebrow: "Our promise",
        title: "Governance rooted in student success",
        paragraphs: [
          "Every decision at PCM flows from one question: how do we best serve our students? The board works closely with faculty, guardians and industry partners to keep our programs relevant, our campus supportive and our graduates ready for the world.",
        ],
        checklist: [
          "Regular curriculum reviews aligned with Pokhara University",
          "Transparent, merit-based scholarship and admission policies",
          "Investment in faculty, facilities and student experience",
        ],
      },
      {
        key: "cta",
        eyebrow: "Enter to Learn — Go Forth to Serve",
        title: "A step towards your future",
        paragraphs: [
          "Applications for the 2083 intake are open across all three programs. Take the first step today.",
        ],
      },
    ],
  },
  {
    slug: "about/campus-map",
    label: "Campus Map",
    hero: {
      title: "Campus Map",
      subtitle:
        "Find your way around the PCM campus — tap a marker to see what's nearby.",
    },
    sections: [
      {
        key: "explore",
        eyebrow: "Getting around",
        title: "Explore the Nadipur campus",
        subtitle:
          "Click a marker on the map or a place in the list to learn more about each spot.",
      },
      {
        key: "location",
        eyebrow: "Location",
        title: "Easy to reach, hard to leave",
        paragraphs: [
          "The PCM campus sits on Gyan Marg at Nadipur — a short ride from Pokhara's Lakeside and Buses Park, with easy access from every part of the city.",
        ],
        checklist: [
          "10 minutes from Lakeside by vehicle",
          "Close to Pokhara Buses Park and public transport",
          "Safe neighbourhood with parking nearby",
        ],
      },
      {
        key: "cta",
        title: "Come visit us at Nadipur",
        paragraphs: [
          "Drop by the campus for a tour, or talk to our admissions team about joining the 2083 intake.",
        ],
      },
    ],
  },
  {
    slug: "about/facility",
    label: "Campus & Facilities",
    hero: {
      title: "Campus & Facilities",
      subtitle:
        "Everything a student needs to learn, create and grow — all on one campus at Nadipur.",
    },
    sections: [
      {
        key: "campus",
        eyebrow: "Our campus",
        title: "Facilities designed around you",
        subtitle:
          "Modern classrooms, dedicated labs, a rich learning resource centre and space to play and unwind.",
      },
      {
        key: "designed",
        eyebrow: "Designed for learning",
        title: "A campus that feels like home",
        paragraphs: [
          "From quiet study corners in the learning resource centre to buzzing group-work zones, the PCM campus supports every kind of learner. High-speed internet, comfortable classrooms and welcoming open spaces make long study days easy.",
        ],
        checklist: [
          "Smart classrooms with modern projectors and AV",
          "Dedicated IT labs for BCSIT practicals",
          "24/7 high-speed campus Wi-Fi",
          "Safe, shaded outdoor spaces for breaks and sports",
        ],
      },
      {
        key: "cta",
        title: "See the campus for yourself",
        paragraphs: [
          "Visit us at Nadipur for a guided tour, or apply today and start your journey at PCM.",
        ],
      },
    ],
  },
  {
    slug: "about/faculty",
    label: "Staff & Faculty",
    hero: {
      title: "Staff & Faculty",
      subtitle:
        "The dedicated people behind PCM — qualified, experienced and genuinely invested in your success.",
    },
    sections: [
      {
        key: "stats",
        eyebrow: "By the numbers",
        title: "A legacy measured in outcomes",
      },
      {
        key: "cta",
        eyebrow: "Enter to Learn — Go Forth to Serve",
        title: "Join a college that cares",
        paragraphs: [
          "Experience the PCM difference for yourself — apply for the 2083 intake today.",
        ],
      },
    ],
  },
  {
    slug: "about/message",
    label: "Words from our leaders",
    hero: {
      title: "Words from our leaders",
      subtitle:
        "A personal welcome from the leadership team at Pokhara College of Management.",
    },
    sections: [
      {
        key: "intro",
        eyebrow: "Leadership voices",
        title: "Words from our leaders",
        subtitle:
          "The people guiding PCM share why they believe in our mission of affordable, quality education.",
      },
      {
        key: "cta",
        eyebrow: "Enter to Learn — Go Forth to Serve",
        title: "A step towards your future",
        paragraphs: [
          "Applications for the 2083 intake are open across all three programs. Take the first step today.",
        ],
      },
    ],
  },
  {
    slug: "clubs",
    label: "Student Clubs",
    hero: {
      title: "Student Clubs",
      subtitle:
        "Six active student clubs at PCM — eco, finance, coding, debate, music and sports — where students lead, create and build skills beyond the classroom.",
    },
    sections: [
      {
        key: "why-join",
        eyebrow: "Why join?",
        title: "Leadership happens outside the lecture hall",
        paragraphs: [
          "Employers look for more than grades. Club leadership, event management and teamwork give PCM students the confidence and experience that make their résumés stand out.",
        ],
      },
      {
        key: "clubs-list",
        eyebrow: "Clubs, one community",
        title: "Find your crew",
        subtitle:
          "Every club is run by students, for students — with a faculty mentor and a calendar of events each semester.",
      },
      {
        key: "cta",
        eyebrow: "Enter to Learn — Go Forth to Serve",
        title: "A step towards your future",
        paragraphs: [
          "Applications for the 2083 intake are open across all three programs. Take the first step today.",
        ],
      },
    ],
  },
  {
    slug: "downloads",
    label: "Downloads",
    hero: {
      title: "Downloads",
      subtitle:
        "Access prospectuses, admission forms, syllabi and scholarship application forms — all in one place.",
    },
    sections: [
      {
        key: "intro",
        eyebrow: "Resources",
        title: "Official documents & forms",
        subtitle:
          "Download the files you need. All documents are current for the 2083 intake.",
      },
      {
        key: "cta",
        eyebrow: "Enter to Learn — Go Forth to Serve",
        title: "A step towards your future",
        paragraphs: [
          "Applications for the 2083 intake are open across all three programs. Take the first step today.",
        ],
      },
    ],
  },
];

export async function seedDefaultPageContents() {
  const db = await getDb();
  await db.createCollection(PAGE_CONTENT_COLLECTION).catch(() => {});

  const col = db.collection<PageContentDocument>(PAGE_CONTENT_COLLECTION);
  const now = new Date();

  for (const def of DEFAULT_CONTENT) {
    const existing = await col.findOne({ slug: def.slug });
    if (existing) continue;
    await col.insertOne({ ...def, updatedAt: now } as PageContentDocument);
  }
}

let readyPromise: Promise<void> | null = null;
export function ensurePageContentsReady() {
  if (!readyPromise) {
    readyPromise = (async () => {
      await ensurePageContentIndexes();
      await seedDefaultPageContents();
    })();
  }
  return readyPromise;
}

// Ensure indexes
let indexesReady: Promise<void> | null = null;
export function ensurePageContentIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      await db.createCollection(PAGE_CONTENT_COLLECTION).catch(() => {});

      const col = db.collection<PageContentDocument>(PAGE_CONTENT_COLLECTION);
      
      await col.createIndex({ slug: 1 }, { unique: true, name: "uniq_slug" });
    })();
  }
  return indexesReady;
}
