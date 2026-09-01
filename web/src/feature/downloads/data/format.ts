/** Format an ISO date string (YYYY-MM-DD) as e.g. "31 Aug 2026". */
export function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Normalise a raw file-size string from the collection (e.g. "1.6 KB").
 * If none is available, returns a dash placeholder.
 */
export function formatSize(size?: string): string {
  return size && size.trim() ? size.trim() : "—";
}
