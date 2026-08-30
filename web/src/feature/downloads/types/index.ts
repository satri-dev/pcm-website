export type DownloadCategory =
  | "All"
  | "Prospectus"
  | "Admission Form"
  | "Syllabus"
  | "Scholarship Form"
  | "Other";

export interface DownloadItem {
  id: string;
  title: string;
  category: Exclude<DownloadCategory, "All">;
  date: string; // "2026-07-01"
  sizeKb: number;
  fileUrl: string;
  description: string;
}
