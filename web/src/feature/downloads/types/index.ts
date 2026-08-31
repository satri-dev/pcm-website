import type { Download } from "@/app/admin/media/downloads/types/download";

/**
 * Public download card item — a published `Download` surfaced on the
 * public downloads page. We keep it as a distinct type so the feature layer
 * never depends on admin internals, but it mirrors the collection shape
 * (string file size, file type, HTML description, download count).
 */
export type DownloadItem = Download;
