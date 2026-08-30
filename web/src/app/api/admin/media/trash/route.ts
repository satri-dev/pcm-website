import { NextResponse } from "next/server";
import {
  listTrashedBlogs,
  autoPurgeTrashedBlogs,
} from "@/repositories/blog.repository";
import {
  listTrashedGallery,
  autoPurgeTrashedGallery,
} from "@/repositories/gallery.repository";
import {
  listTrashedDownloads,
  autoPurgeTrashedDownloads,
} from "@/repositories/download.repository";

export async function GET() {
  await Promise.all([
    autoPurgeTrashedBlogs(),
    autoPurgeTrashedGallery(),
    autoPurgeTrashedDownloads(),
  ]);

  const [blogs, gallery, downloads] = await Promise.all([
    listTrashedBlogs({ pageSize: 200 }),
    listTrashedGallery({ pageSize: 200 }),
    listTrashedDownloads({ pageSize: 200 }),
  ]);

  const items = [
    ...blogs.items.map((i) => ({
      id: i.id,
      name: i.title,
      collection: "blogs",
      deletedAt: i.deletedAt,
    })),
    ...gallery.items.map((i) => ({
      id: i.id,
      name: i.title,
      collection: "gallery",
      deletedAt: i.deletedAt,
    })),
    ...downloads.items.map((i) => ({
      id: i.id,
      name: i.title,
      collection: "downloads",
      deletedAt: i.deletedAt,
    })),
  ].sort(
    (a, b) =>
      new Date(b.deletedAt ?? 0).getTime() -
      new Date(a.deletedAt ?? 0).getTime()
  );

  return NextResponse.json({ items, total: items.length });
}
