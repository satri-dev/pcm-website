// src/lib/seo-utils.ts
// Centralized SEO utilities for consistent metadata across the site

/**
 * Get the base URL for the site based on environment
 * Priority: NEXT_PUBLIC_SITE_URL > NEXT_PUBLIC_VERCEL_URL > localhost
 */
export function getBaseUrl(): string {
  // 1. Use explicit NEXT_PUBLIC_SITE_URL if set (production/staging)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // 2. Use Vercel URL if available (for preview deployments)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  // 3. Fallback to localhost for development
  return "http://localhost:3000";
}

/**
 * Create an absolute canonical URL from a relative path
 * @param path - Relative path like "/about" or "/programs/bba"
 * @returns Absolute URL like "https://www.pcm.edu.np/about"
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // Remove trailing slash from base URL if present
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalizedBase}${normalizedPath}`;
}

/**
 * Create an absolute image URL from a relative path
 * @param path - Relative path like "/images/hero.jpg"
 * @returns Absolute URL
 */
export function getAbsoluteUrl(path: string): string {
  return getCanonicalUrl(path);
}

/**
 * Default OpenGraph metadata generator
 */
export function createOpenGraphMetadata({
  title,
  description,
  url,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: "website" | "article";
}) {
  return {
    type,
    siteName: "Pokhara College of Management",
    title,
    description,
    url,
    locale: "en_US",
    images: image ? [{ url: image }] : [],
  };
}

/**
 * Default Twitter Card metadata generator
 */
export function createTwitterMetadata({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image?: string;
}) {
  return {
    card: "summary_large_image" as const,
    title,
    description,
    images: image ? [image] : [],
  };
}
