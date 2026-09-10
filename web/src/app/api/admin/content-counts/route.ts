import { NextResponse } from "next/server";
import { requireApiSession } from "@/core/lib/api-guard";
import { getDb } from "@/core/lib/db";
import { listBackups } from "@/core/lib/backup-utils";
import { USER_COLLECTION } from "@/app/admin/system/users/types";
import { listNews, listTrashedNews } from "@/repositories/news.repository";
import { listNotices, listTrashedNotices } from "@/repositories/notices.repository";
import { listResults, listTrashedResults } from "@/repositories/results.repository";
import { listEvents, listTrashedEvents } from "@/repositories/events.repository";
import { listPrograms, listTrashedPrograms } from "@/repositories/programs.repository";
import { listScholarships, listTrashedScholarships } from "@/repositories/scholarships.repository";
import { listFaqs, listTrashedFaqs } from "@/repositories/faqs.repository";
import { listBlogs, listTrashedBlogs } from "@/repositories/blog.repository";
import { listGallery, listTrashedGallery } from "@/repositories/gallery.repository";
import { listDownloads, listTrashedDownloads } from "@/repositories/download.repository";
import { listApplications } from "@/repositories/application.repository";
import { countFeedback } from "@/repositories/feedback.repository";
import { countSurveyResponses } from "@/repositories/survey-responses.repository";
import { listTestimonials } from "@/repositories/testimonial.repository";
import { listBlogStudents, listTrashedBlogStudents } from "@/repositories/blog-student.repository";
import { listSurveys, listTrashedSurveys } from "@/repositories/surveys.repository";
import { listFaculty } from "@/repositories/faculty.repository";
import { listBoard } from "@/repositories/board.repository";
import { listMessages } from "@/repositories/message.repository";
import { listAlumni } from "@/repositories/alumni.repository";
import { listClubs } from "@/repositories/club.repository";
import { listFacilities, listTrashedFacilities } from "@/repositories/facilities.repository";
import { listCampusMap, listTrashedCampusMap } from "@/repositories/campus-map.repository";
import { listChatbotEntries, listTrashedChatbotEntries } from "@/repositories/chatbot.repository";

export async function GET() {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  try {
    const [
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
      surveyResponses,
      testimonials,
      blogStudents,
      surveys,
      faculty,
      board,
      leadershipMessages,
      alumni,
      clubs,
      facilities,
      campusMap,
      chatbot,
    ] = await Promise.all([
      listNews({ pageSize: 1 }).then((r) => r.total),
      listNotices({ pageSize: 1 }).then((r) => r.total),
      listResults({ pageSize: 1 }).then((r) => r.total),
      listEvents({ pageSize: 1 }).then((r) => r.total),
      listPrograms({ pageSize: 1 }).then((r) => r.total),
      listScholarships({ pageSize: 1 }).then((r) => r.total),
      listFaqs({ pageSize: 1 }).then((r) => r.total),
      listBlogs({ pageSize: 1 }).then((r) => r.total),
      listGallery({ pageSize: 1 }).then((r) => r.total),
      listDownloads({ pageSize: 1 }).then((r) => r.total),
      listApplications({ pageSize: 1 }).then((r) => r.total),
      countFeedback(),
      countSurveyResponses(),
      listTestimonials({ pageSize: 1 }).then((r) => r.total),
      listBlogStudents({ pageSize: 1 }).then((r) => r.total),
      listSurveys({ pageSize: 1 }).then((r) => r.total),
      listFaculty({ pageSize: 1 }).then((r) => r.total),
      listBoard({ pageSize: 1 }).then((r) => r.total),
      listMessages({ pageSize: 1 }).then((r) => r.total),
      listAlumni({ pageSize: 1 }).then((r) => r.total),
      listClubs({ pageSize: 1 }).then((r) => r.total),
      listFacilities({ pageSize: 1 }).then((r) => r.total),
      listCampusMap({ pageSize: 1 }).then((r) => r.total),
      listChatbotEntries({ pageSize: 1 }).then((r) => r.total),
    ]);

    const [
      trashedNews,
      trashedNotices,
      trashedResults,
      trashedEvents,
      trashedPrograms,
      trashedScholarships,
      trashedFaqs,
      trashedSurveys,
      trashedBlogStudents,
      trashedBlogs,
      trashedGallery,
      trashedDownloads,
      trashedFacilities,
      trashedCampusMap,
      trashedChatbotEntries,
    ] = await Promise.all([
      listTrashedNews({ pageSize: 1 }).then((r) => r.total),
      listTrashedNotices({ pageSize: 1 }).then((r) => r.total),
      listTrashedResults({ pageSize: 1 }).then((r) => r.total),
      listTrashedEvents({ pageSize: 1 }).then((r) => r.total),
      listTrashedPrograms({ pageSize: 1 }).then((r) => r.total),
      listTrashedScholarships({ pageSize: 1 }).then((r) => r.total),
      listTrashedFaqs({ pageSize: 1 }).then((r) => r.total),
      listTrashedSurveys({ pageSize: 1 }).then((r) => r.total),
      listTrashedBlogStudents({ pageSize: 1 }).then((r) => r.total),
      listTrashedBlogs({ pageSize: 1 }).then((r) => r.total),
      listTrashedGallery({ pageSize: 1 }).then((r) => r.total),
      listTrashedDownloads({ pageSize: 1 }).then((r) => r.total),
      listTrashedFacilities({ pageSize: 1 }).then((r) => r.total),
      listTrashedCampusMap({ pageSize: 1 }).then((r) => r.total),
      listTrashedChatbotEntries({ pageSize: 1 }).then((r) => r.total),
    ]);

    const db = await getDb();
    const usersCollection = db.collection(USER_COLLECTION);
    const [users, bannedUsers] = await Promise.all([
      usersCollection.countDocuments({ banned: { $ne: true } }),
      usersCollection.countDocuments({ banned: true }),
    ]);
    const backups = listBackups().length;

    const contentTrash =
      trashedNews +
      trashedNotices +
      trashedResults +
      trashedEvents +
      trashedPrograms +
      trashedScholarships +
      trashedFaqs +
      trashedSurveys +
      trashedBlogStudents;

    const mediaTrash =
      trashedBlogs + trashedGallery + trashedDownloads;

    const campusTrash = trashedFacilities + trashedCampusMap;

    const systemTrash = trashedChatbotEntries + bannedUsers;

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
      surveyResponses,
      testimonials,
      blogStudent: blogStudents,
      surveys,
      faculty,
      board,
      leadershipMessages,
      alumni,
      clubs,
      facilities,
      campusMap,
      chatbot,
      users,
      backups,
      trash: contentTrash,
      mediaTrash,
      campusTrash,
      systemTrash,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch counts" },
      { status: 500 }
    );
  }
}