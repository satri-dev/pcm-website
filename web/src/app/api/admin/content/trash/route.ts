import { NextResponse } from "next/server";
import {
  listTrashedNews,
  autoPurgeTrashedNews,
} from "@/repositories/news.repository";
import {
  listTrashedNotices,
  autoPurgeTrashedNotices,
} from "@/repositories/notices.repository";
import {
  listTrashedResults,
  autoPurgeTrashedResults,
} from "@/repositories/results.repository";
import {
  listTrashedEvents,
  autoPurgeTrashedEvents,
} from "@/repositories/events.repository";
import {
  listTrashedPrograms,
  autoPurgeTrashedPrograms,
} from "@/repositories/programs.repository";
import {
  listTrashedScholarships,
  autoPurgeTrashedScholarships,
} from "@/repositories/scholarships.repository";
import {
  listTrashedFaqs,
  autoPurgeTrashedFaqs,
} from "@/repositories/faqs.repository";
import {
  listTrashedSurveys,
  autoPurgeTrashedSurveys,
} from "@/repositories/surveys.repository";

export async function GET() {
  await Promise.all([
    autoPurgeTrashedNews(),
    autoPurgeTrashedNotices(),
    autoPurgeTrashedResults(),
    autoPurgeTrashedEvents(),
    autoPurgeTrashedPrograms(),
    autoPurgeTrashedScholarships(),
    autoPurgeTrashedFaqs(),
    autoPurgeTrashedSurveys(),
  ]);

  const [news, notices, results, events, programs, scholarships, faqs, surveys] =
    await Promise.all([
      listTrashedNews({ pageSize: 200 }),
      listTrashedNotices({ pageSize: 200 }),
      listTrashedResults({ pageSize: 200 }),
      listTrashedEvents({ pageSize: 200 }),
      listTrashedPrograms({ pageSize: 200 }),
      listTrashedScholarships({ pageSize: 200 }),
      listTrashedFaqs({ pageSize: 200 }),
      listTrashedSurveys({ pageSize: 200 }),
    ]);

  const items = [
    ...news.items.map((i) => ({
      id: i.id,
      name: i.title,
      collection: "news",
      deletedAt: i.deletedAt,
    })),
    ...notices.items.map((i) => ({
      id: i.id,
      name: i.title,
      collection: "notices",
      deletedAt: i.deletedAt,
    })),
    ...results.items.map((i) => ({
      id: i.id,
      name: i.title,
      collection: "results",
      deletedAt: i.deletedAt,
    })),
    ...events.items.map((i) => ({
      id: i.id,
      name: i.title,
      collection: "events",
      deletedAt: i.deletedAt,
    })),
    ...programs.items.map((i) => ({
      id: i.id,
      name: i.name,
      collection: "programs",
      deletedAt: i.deletedAt,
    })),
    ...scholarships.items.map((i) => ({
      id: i.id,
      name: i.title,
      collection: "scholarships",
      deletedAt: i.deletedAt,
    })),
    ...faqs.items.map((i) => ({
      id: i.id,
      name: i.question,
      collection: "faqs",
      deletedAt: i.deletedAt,
    })),
    ...surveys.items.map((i) => ({
      id: i.id,
      name: i.title,
      collection: "surveys",
      deletedAt: i.deletedAt,
    })),
  ].sort(
    (a, b) =>
      new Date(b.deletedAt ?? 0).getTime() -
      new Date(a.deletedAt ?? 0).getTime()
  );

  return NextResponse.json({ items, total: items.length });
}
