import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/core/lib/cloudinary";
import { guardPublicWrite } from "@/core/lib/rate-limit";

// Only these keys may be signed. Anything else (e.g. transformation, eager,
// overwrite, invalidate, tags, context, metadata) is rejected so a caller
// cannot obtain server-signed upload signatures for dangerous options.
const ALLOWED_SIGN_PARAMS = new Set([
  "timestamp",
  "public_id",
  "folder",
  "format",
  "type",
  "resource_type",
]);

const MAX_PARAM_STRING = 500;
const MAX_TOLERANCE_SECONDS = 600;

export async function POST(request: NextRequest) {
  const limited = guardPublicWrite(request, { limit: 60, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const { paramsToSign } = await request.json();

    if (
      !paramsToSign ||
      typeof paramsToSign !== "object" ||
      Array.isArray(paramsToSign)
    ) {
      return NextResponse.json(
        { error: "Missing paramsToSign" },
        { status: 400 }
      );
    }

    // Reject stale/replayed timestamps.
    const timestamp = Number(paramsToSign.timestamp);
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (!Number.isFinite(timestamp) || Math.abs(nowSeconds - timestamp) > MAX_TOLERANCE_SECONDS) {
      return NextResponse.json(
        { error: "Invalid or expired timestamp" },
        { status: 400 }
      );
    }

    const signed: Record<string, string> = { timestamp: String(timestamp) };
    for (const [key, value] of Object.entries(paramsToSign)) {
      if (!ALLOWED_SIGN_PARAMS.has(key)) continue;
      if (typeof value === "string" && value.length <= MAX_PARAM_STRING) {
        signed[key] = value;
      }
    }

    const signature = cloudinary.utils.api_sign_request(
      signed,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error("Cloudinary signature error:", error);

    return NextResponse.json(
      { error: "Failed to generate Cloudinary signature" },
      { status: 500 }
    );
  }
}