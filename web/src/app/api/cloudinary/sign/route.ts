import { NextResponse } from "next/server";
import cloudinary from "@/core/lib/cloudinary";

export async function POST(request: Request) {
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

    if (!paramsToSign) {
      return NextResponse.json(
        { error: "Invalid timestamp" },
        { status: 400 }
      );
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
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