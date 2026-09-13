import { NextResponse } from "next/server";
import cloudinary from "@/core/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const { paramsToSign } = await request.json();

    if (!paramsToSign) {
      return NextResponse.json(
        { error: "Missing paramsToSign" },
        { status: 400 }
      );
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
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