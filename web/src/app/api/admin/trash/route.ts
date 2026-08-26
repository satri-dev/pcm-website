import { NextResponse } from "next/server";
import { listTrashedFacilities } from "@/repositories/facilities.repository";
import { listTrashedCampusMap } from "@/repositories/campus-map.repository";
import { listTrashedNews } from "@/repositories/news.repository";
import { listTrashedNotices } from "@/repositories/notices.repository";
import { listTrashedResults } from "@/repositories/results.repository";
import { listTrashedEvents } from "@/repositories/events.repository";
import { listTrashedPrograms } from "@/repositories/programs.repository";
import { listTrashedScholarships } from "@/repositories/scholarships.repository";
import { listTrashedFaqs } from "@/repositories/faqs.repository";
import { listTrashedBlogs } from "@/repositories/blog.repository";
import { listTrashedGallery } from "@/repositories/gallery.repository";
import { listTrashedDownloads } from "@/repositories/download.repository";
import { listTrashedChatbotEntries } from "@/repositories/chatbot.repository";

export async function GET() {
  const counts = await Promise.all([
    listTrashedFacilities({ pageSize: 1 }),
    listTrashedCampusMap({ pageSize: 1 }),
    listTrashedNews({ pageSize: 1 }),
    listTrashedNotices({ pageSize: 1 }),
    listTrashedResults({ pageSize: 1 }),
    listTrashedEvents({ pageSize: 1 }),
    listTrashedPrograms({ pageSize: 1 }),
    listTrashedScholarships({ pageSize: 1 }),
    listTrashedFaqs({ pageSize: 1 }),
    listTrashedBlogs({ pageSize: 1 }),
    listTrashedGallery({ pageSize: 1 }),
    listTrashedDownloads({ pageSize: 1 }),
    listTrashedChatbotEntries({ pageSize: 1 }),
  ]);

  const total = counts.reduce((sum, c) => sum + c.total, 0);

  return NextResponse.json({ total });
}
