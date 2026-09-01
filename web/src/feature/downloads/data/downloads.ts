import type { DownloadCategory } from "@/app/admin/media/downloads/types/download";

export { formatDate } from "./format";

/** Icon (emoji) per known download category, with a sensible fallback. */
export const CATEGORY_ICONS: Record<string, string> = {
  Forms: "📝",
  Syllabus: "📚",
  Reports: "📊",
  Certificates: "🏅",
  Brochures: "📘",
  Applications: "📄",
  "Fee Structures": "💰",
  Others: "📁",
};

/**
 * The full set of categories admins can assign (mirrors the admin enum).
 * Used only as a fallback ordering/icon source; the actual filter tabs shown
 * on the public page are derived from the published catalogue.
 */
export const ALL_CATEGORIES: readonly DownloadCategory[] = [
  "Forms",
  "Syllabus",
  "Reports",
  "Certificates",
  "Brochures",
  "Applications",
  "Fee Structures",
  "Others",
];

/**
 * Build the ordered list of filter categories from a set of published
 * downloads. Guarantees "All" is always first and keeps "Others" last.
 */
export function deriveCategories(categories: string[]): string[] {
  const present = new Set(categories);
  const ordered = ALL_CATEGORIES.filter((c) => present.has(c));
  const others = ordered.includes("Others") ? "Others" : null;
  const seen = ordered.filter((c) => c !== "Others");
  return ["All", ...seen, ...(others ? [others] : [])];
}
