export type DownloadCategory =
  | "Forms"
  | "Syllabus"
  | "Reports"
  | "Certificates"
  | "Brochures"
  | "Applications"
  | "Fee Structures"
  | "Others";

export const DOWNLOAD_CATEGORIES: readonly DownloadCategory[] = [
  "Forms",
  "Syllabus",
  "Reports",
  "Certificates",
  "Brochures",
  "Applications",
  "Fee Structures",
  "Others",
];

export type DownloadStatus = "published" | "draft";

export const DOWNLOAD_STATUSES: readonly DownloadStatus[] = [
  "published",
  "draft",
];

export const DOWNLOAD_COLLECTION = "downloads";

export interface Download {
  id: string;
  title: string;
  description: string;
  category: DownloadCategory;
  fileUrl: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  date: string;
  status: DownloadStatus;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DownloadDocument {
  _id?: import("mongodb").ObjectId;
  title: string;
  description: string;
  category: DownloadCategory;
  fileUrl: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  date: Date;
  status: DownloadStatus;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DownloadCreateInput {
  title: string;
  description: string;
  category: DownloadCategory;
  fileUrl: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  date: string;
  status: DownloadStatus;
  downloadCount?: number;
}

export type DownloadUpdateInput = Partial<DownloadCreateInput>;
