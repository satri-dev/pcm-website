import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeToNewsletter } from "@/repositories/newsletter.repository";
import { guardPublicWrite } from "@/core/lib/rate-limit";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().max(200).optional(),
});

export async function POST(request: NextRequest) {
  const limited = guardPublicWrite(request, { limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    await subscribeToNewsletter(parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}
