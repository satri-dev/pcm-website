// src/core/lib/dashboard-stats.ts
// Server-side count queries for the admin dashboard summary cards. Queries
// all collections in parallel with pageSize:1 so only totals are fetched.
import { listNews } from "@/repositories/news.repository";
import { listNotices } from "@/repositories/notices.repository";
import { listGallery } from "@/repositories/gallery.repository";
import { listFaculty } from "@/repositories/faculty.repository";
import { listPrograms } from "@/repositories/programs.repository";
import { listDownloads } from "@/repositories/download.repository";
import { countFeedback } from "@/repositories/feedback.repository";
import { countSurveyResponses } from "@/repositories/survey-responses.repository";

export async function getDashboardCounts() {
  const [news, notices, gallery, faculty, programs, downloads, feedback, surveyResponses] =
    await Promise.all([
      listNews({ pageSize: 1 }).then((r) => r.total),
      listNotices({ pageSize: 1 }).then((r) => r.total),
      listGallery({ pageSize: 1 }).then((r) => r.total),
      listFaculty({ pageSize: 1 }).then((r) => r.total),
      listPrograms({ pageSize: 1 }).then((r) => r.total),
      listDownloads({ pageSize: 1 }).then((r) => r.total),
      countFeedback(),
      countSurveyResponses(),
    ]);

  return {
    news,
    notices,
    gallery,
    faculty,
    programs,
    downloads,
    feedback,
    surveyResponses,
    enquiries: feedback + surveyResponses,
  };
}