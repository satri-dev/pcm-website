import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { unsubscribeFromNewsletter } from "@/repositories/newsletter.repository";

const unsubscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = unsubscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const success = await unsubscribeFromNewsletter(parsed.data.email);

    if (!success) {
      return NextResponse.json(
        { error: "Email not found or already unsubscribed" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe. Please try again later." },
      { status: 500 }
    );
  }
}
