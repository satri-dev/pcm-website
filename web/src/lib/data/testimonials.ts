// src/lib/data/testimonials.ts
// Server-side data access for testimonials. Testimonials are stored in the
// homepage collection and reused on both the public homepage and /about pages.
// The homepage data is cached with its own tag; revalidation is handled by the
// admin home page settings API route.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getHomepage } from "@/repositories/homepage.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { HomepageTestimonial } from "@/types/homepage";

export async function getAboutTestimonials(): Promise<HomepageTestimonial[]> {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.homepage);

  const data = await getHomepage();
  return data.testimonials;
}
