import type { DownloadCategory, DownloadItem } from "../types";

export const DOWNLOAD_CATEGORIES: DownloadCategory[] = [
  "All",
  "Prospectus",
  "Admission Form",
  "Syllabus",
  "Scholarship Form",
  "Other",
];

export const CATEGORY_ICONS: Record<string, string> = {
  Prospectus: "📘",
  "Admission Form": "📝",
  Syllabus: "📚",
  "Scholarship Form": "🎓",
  Other: "📄",
};

export const downloadItems: DownloadItem[] = [
  {
    id: "dl-1",
    title: "PCM Prospectus 2083",
    category: "Prospectus",
    date: "2026-07-01",
    sizeKb: 2400,
    fileUrl: "/assets/pdf/prospectus-2083.pdf",
    description:
      "Complete prospectus for the 2083 intake — programs, fees, facilities and admission details.",
  },
  {
    id: "dl-2",
    title: "Admission Application Form 2083",
    category: "Admission Form",
    date: "2026-07-01",
    sizeKb: 380,
    fileUrl: "/assets/pdf/admission-form-2083.pdf",
    description:
      "Application form for BBA, BBA-Finance and BCSIT admissions. Submit to the college office.",
  },
  {
    id: "dl-3",
    title: "BBA Syllabus (Pokhara University)",
    category: "Syllabus",
    date: "2026-06-15",
    sizeKb: 5200,
    fileUrl: "/assets/pdf/syllabus-bba.pdf",
    description:
      "Full BBA course structure and curriculum as per Pokhara University.",
  },
  {
    id: "dl-4",
    title: "BCSIT Syllabus (Pokhara University)",
    category: "Syllabus",
    date: "2026-06-15",
    sizeKb: 5800,
    fileUrl: "/assets/pdf/syllabus-bcsit.pdf",
    description:
      "Full BCSIT course structure and curriculum as per Pokhara University.",
  },
  {
    id: "dl-5",
    title: "Scholarship Application Form",
    category: "Scholarship Form",
    date: "2026-06-20",
    sizeKb: 210,
    fileUrl: "/assets/pdf/scholarship-form.pdf",
    description:
      "Apply for merit and need-based scholarships under PCM's support programs.",
  },
];

/* ── Helper functions ── */

export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatSize(kb: number): string {
  if (kb >= 1024) {
    const mb = kb / 1024;
    return `${mb % 1 === 0 ? mb : mb.toFixed(1)} MB`;
  }
  return `${kb} KB`;
}
