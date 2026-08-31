import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeToNewsletter } from "@/repositories/newsletter.repository";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const subscriber = await subscribeToNewsletter(parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter!",
        subscriber: {
          email: subscriber.email,
          subscribedAt: subscriber.subscribedAt,
        },
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
