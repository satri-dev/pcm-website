import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// Serve files from the root-level assets/ folder (one level above web/)
const ASSETS_ROOT = path.resolve(process.cwd(), "..", "assets");

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  svg: "image/svg+xml",
  webp: "image/webp",
  ico: "image/x-icon",
  css: "text/css",
  js: "application/javascript",
  json: "application/json",
  pdf: "application/pdf",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  // Prevent path traversal
  const relative = segments.join("/");
  if (relative.includes("..")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const filePath = path.join(ASSETS_ROOT, relative);

  // Ensure the resolved path is still inside ASSETS_ROOT
  if (!filePath.startsWith(ASSETS_ROOT)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const buffer = await readFile(filePath);
    const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
    const contentType = MIME[ext] ?? "application/octet-stream";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
