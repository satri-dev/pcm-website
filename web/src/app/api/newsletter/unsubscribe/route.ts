import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { unsubscribeFromNewsletter } from "@/repositories/newsletter.repository";
import { guardPublicWrite } from "@/core/lib/rate-limit";

const unsubscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  const limited = guardPublicWrite(request, { limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const parsed = unsubscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    await unsubscribeFromNewsletter(parsed.data.email);

    // Unsubscribe is idempotent and returns a generic success — we don't reveal
    // whether an address is (or was) subscribed.
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
