// src/lib/data/homepage.ts
// Server-side data access for the public home page. Uses no-store
// so the page always reads fresh data from MongoDB, which is then
// cached at the HTTP / CDN layer via standard Next.js fetch caching.
// When the admin updates homepage content, the next page load always
// sees the latest data.
import { getHomepage } from "@/repositories/homepage.repository";

export async function getHomepageData() {
  return getHomepage();
}
