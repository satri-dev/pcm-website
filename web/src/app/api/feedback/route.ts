import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import { getDb } from "@/core/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getFeedbackSettings } from "@/lib/data/feedback-page-settings";
import { ensureFeedbackIndexes } from "@/repositories/feedback.repository";

export async function POST(req: NextRequest) {
  try {
    const settings = await getFeedbackSettings();
    const body = await req.json();
    const fields: Record<string, unknown> = body?.fields ?? {};
    const anonymous = Boolean(body?.anonymous);

    // Rating is a built-in field when enabled.
    if (settings.ratingEnabled) {
      const rating = fields.rating;
      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return NextResponse.json(
          { success: false, error: "A rating between 1 and 5 is required." },
          { status: 400 }
        );
      }
    }

    // Validate the dynamic fields against the admin-configured schema.
    for (const field of settings.fields) {
      const value = fields[field.id];
      const empty =
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        value === false;

      if (field.required && empty) {
        return NextResponse.json(
          { success: false, error: `${field.label} is required.` },
          { status: 400 }
        );
      }

      if (!empty && field.type === "email" && typeof value === "string") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return NextResponse.json(
            { success: false, error: "Please enter a valid email address." },
            { status: 400 }
          );
        }
      }

      if (!empty && field.type === "number" && typeof value === "number") {
        if (field.min !== undefined && value < field.min) {
          return NextResponse.json(
            { success: false, error: `${field.label} must be at least ${field.min}.` },
            { status: 400 }
          );
        }
        if (field.max !== undefined && value > field.max) {
          return NextResponse.json(
            { success: false, error: `${field.label} must be at most ${field.max}.` },
            { status: 400 }
          );
        }
      }
    }

    const db = await getDb();
    const cleanFields = fields as Record<string, unknown>;
    
    // If anonymous, remove identifying fields (name, email)
    if (anonymous) {
      delete cleanFields.name;
      delete cleanFields.email;
    }
    
    await ensureFeedbackIndexes();

    await db.collection("feedback").insertOne({
      _id: new ObjectId(),
      fields: cleanFields,
      fieldSchema: settings.fields,
      anonymous,
      createdAt: new Date(),
    });
    revalidateTag(CACHE_TAGS.feedbackList, "max");

    return NextResponse.json({ success: true, message: "Thank you for your feedback!" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
