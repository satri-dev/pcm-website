// src/lib/data/testimonials.ts
// Server-side data access for testimonials. Testimonials are stored in the
// homepage collection and reused on both the public homepage and /about pages.
// The homepage data is cached with its own tag; revalidation is handled by the
// admin home page settings API route.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getHomepage } from "@/repositories/homepage.repository";
import { listApprovedTestimonials } from "@/repositories/testimonial.repository";
import { getTestimonialPageSettings } from "@/repositories/testimonial-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { HomepageTestimonial } from "@/types/homepage";
import type { Testimonial } from "@/types/testimonial";

export async function getAboutTestimonials(): Promise<HomepageTestimonial[]> {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.homepage);

  const data = await getHomepage();
  return data.testimonials;
}

// Public /testimonials page — only approved submissions. Cached and
// invalidated via CACHE_TAGS.testimonialsList whenever an admin
// approves/rejects/deletes or a new submission is created.
export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.testimonialsList);

  return await listApprovedTestimonials();
}

// Configurable page settings for the public /testimonials page (hero, section
// head, add-button toggle/copy, CTA band, SEO). Cached and invalidated via
// CACHE_TAGS.testimonialsSettings whenever an admin saves the settings.
export async function getTestimonialSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.testimonialsSettings);

  return await getTestimonialPageSettings();
}
