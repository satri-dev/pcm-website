import { NextResponse } from "next/server";
import { requireApiSession } from "@/core/lib/api-guard";
import { listNews } from "@/repositories/news.repository";
import { listNotices } from "@/repositories/notices.repository";
import { listResults } from "@/repositories/results.repository";
import { listEvents } from "@/repositories/events.repository";
import { listPrograms } from "@/repositories/programs.repository";
import { listScholarships } from "@/repositories/scholarships.repository";
import { listFaqs } from "@/repositories/faqs.repository";
import { listBlogs } from "@/repositories/blog.repository";
import { listGallery } from "@/repositories/gallery.repository";
import { listDownloads } from "@/repositories/download.repository";
import { listApplications } from "@/repositories/application.repository";
import { countFeedback } from "@/repositories/feedback.repository";
import { countSurveyResponses } from "@/repositories/survey-responses.repository";


export async function GET() {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  try {
    const [news, notices, results, events, programs, scholarships, faqs, blogs, gallery, downloads, applications, feedback, surveyResponses] =
      await Promise.all([
        listNews({ pageSize: 1 }).then((r) => r.total),
        listNotices({ pageSize: 1 }).then((r) => r.total),
        listResults({ pageSize: 1 }).then((r) => r.total),
        listEvents({ pageSize: 1 }).then((r) => r.total),
        listPrograms({ pageSize: 1 }).then((r) => r.total),
        listScholarships({ pageSize: 1 }).then((r) => r.total),
        listFaqs({ pageSize: 1 }).then((r) => r.total),
        listBlogs({ pageSize: 1 }).then((r) => r.total),
        listGallery({ pageSize: 1 }).then((r) => r.total),
        listDownloads({pageSize: 1}).then((r)=>r.total),
        listApplications({ pageSize: 1 }).then((r) => r.total),
        countFeedback(),
        countSurveyResponses()
      ]);

    return NextResponse.json({
      news,
      notices,
      results,
      events,
      programs,
      scholarships,
      faqs,
      blogs,
      gallery,
      downloads,
      applications,
      feedback,
      surveyResponses
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch counts" },
      { status: 500 }
    );
  }
}
