// src/lib/data/blogs.ts
// Cached data fetchers for blog items from MongoDB.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listBlogs, getPublishedBlogBySlug } from "@/repositories/blog.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getPublishedBlogs() {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.blogsList);
  const { items } = await listBlogs({
    status: "published",
    pageSize: 50,
    sort: { date: -1, createdAt: -1 },
  });
  return items;
}

export async function getPublishedBlogBySlugCached(slug: string) {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.blogsList, CACHE_TAGS.blog(slug));
  return getPublishedBlogBySlug(slug);
}