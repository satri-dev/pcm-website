
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/core/lib/cloudinary";
import { guardPublicWrite } from "@/core/lib/rate-limit";

// Only these parameters may be signed.
const ALLOWED_SIGN_PARAMS = new Set([
  "timestamp",
  "upload_preset",
  "public_id",
  "folder",
  "format",
  "type",
  "resource_type",
]);

// Only approved presets may be used.
const ALLOWED_UPLOAD_PRESETS = new Set([
  "pcm-images",
  "pcm-documents",
]);

const MAX_PARAM_STRING = 500;
const MAX_TOLERANCE_SECONDS = 600;

function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export async function POST(request: NextRequest) {
  const limited = guardPublicWrite(request, {
    limit: 60,
    windowMs: 60_000,
  });

  if (limited) return limited;

  try {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    if (!apiSecret || !apiKey) {
      console.error(
        "Cloudinary environment variables are missing"
      );

      return NextResponse.json(
        { error: "Cloudinary is not configured" },
        { status: 500 }
      );
    }

    const body: unknown = await request.json();

    if (!isPlainObject(body)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const paramsToSign = body.paramsToSign;

    if (!isPlainObject(paramsToSign)) {
      return NextResponse.json(
        { error: "Missing paramsToSign" },
        { status: 400 }
      );
    }

    // Validate timestamp.
    const timestampValue = paramsToSign.timestamp;

    if (
      typeof timestampValue !== "number" &&
      typeof timestampValue !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid timestamp" },
        { status: 400 }
      );
    }

    const timestamp = Number(timestampValue);
    const nowSeconds = Math.floor(Date.now() / 1000);

    if (
      !Number.isSafeInteger(timestamp) ||
      Math.abs(nowSeconds - timestamp) > MAX_TOLERANCE_SECONDS
    ) {
      return NextResponse.json(
        { error: "Invalid or expired timestamp" },
        { status: 400 }
      );
    }

    const signed: Record<string, string> = {
      timestamp: String(timestamp),
    };

    for (const [key, value] of Object.entries(paramsToSign)) {
      if (key === "timestamp") continue;

      if (!ALLOWED_SIGN_PARAMS.has(key)) {
        continue;
      }

      if (typeof value !== "string") {
        return NextResponse.json(
          { error: `Invalid parameter: ${key}` },
          { status: 400 }
        );
      }

      if (value.length === 0 || value.length > MAX_PARAM_STRING) {
        return NextResponse.json(
          { error: `Invalid parameter length: ${key}` },
          { status: 400 }
        );
      }

      if (
        key === "upload_preset" &&
        !ALLOWED_UPLOAD_PRESETS.has(value)
      ) {
        return NextResponse.json(
          { error: "Invalid upload preset" },
          { status: 400 }
        );
      }

      signed[key] = value;
    }

    if (!signed.upload_preset) {
      return NextResponse.json(
        { error: "Missing upload_preset" },
        { status: 400 }
      );
    }

    const signature = cloudinary.utils.api_sign_request(
      signed,
      apiSecret
    );

    return NextResponse.json({
      signature,
      apiKey,
    });
  } catch (error) {
    console.error("Cloudinary signature error:", error);

    return NextResponse.json(
      { error: "Failed to generate Cloudinary signature" },
      { status: 500 }
    );
  }
}