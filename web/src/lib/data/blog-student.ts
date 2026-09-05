// src/lib/data/blog-student.ts
// Cached data fetcher for approved student blogs from MongoDB.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import {
  getApprovedBlogStudentBySlug,
  listApprovedBlogStudents,
} from "@/repositories/blog-student.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getApprovedBlogStudents() {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.blogStudentList);
  return listApprovedBlogStudents();
}

export async function getApprovedBlogStudentCached(slug: string) {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.blogStudentBySlug(slug));
  return getApprovedBlogStudentBySlug(slug);
}