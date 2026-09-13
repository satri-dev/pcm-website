import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import { getDb } from "@/core/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getFeedbackSettings } from "@/lib/data/feedback-page-settings";
import { ensureFeedbackIndexes } from "@/repositories/feedback.repository";
import { guardPublicWrite } from "@/core/lib/rate-limit";
import { capString, sanitizeUntrustedObject } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  const limited = guardPublicWrite(req, { limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const settings = await getFeedbackSettings();
    const body = await req.json();
    const rawFields: Record<string, unknown> = body?.fields ?? {};
    const anonymous = Boolean(body?.anonymous);

    // Given set of legal field ids: configured fields + the built-in rating.
    const legalIds = new Set<string>(settings.fields.map((f) => f.id));
    if (settings.ratingEnabled) legalIds.add("rating");

    // Whitelist submitted keys, coerce numeric strings, and bound lengths.
    const fields: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rawFields)) {
      if (!legalIds.has(key)) continue;
      const config = settings.fields.find((f) => f.id === key);

      if (config?.type === "number" && typeof value === "string" && value.trim() !== "") {
        const numeric = Number(value);
        fields[key] = Number.isNaN(numeric) ? value : numeric;
        continue;
      }

      if (typeof value === "string") {
        fields[key] = capString(value, config === undefined ? 200 : 5000);
        continue;
      }

      if (typeof value === "number" || typeof value === "boolean") {
        fields[key] = value;
        continue;
      }

      // Only configured select fields accept arrays.
      if (Array.isArray(value) && config) {
        fields[key] = value.slice(0, 50).map((v) =>
          typeof v === "string" ? capString(v, 200) : v
        );
      }
    }

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
      fields: sanitizeUntrustedObject(cleanFields, {
        maxDepth: 3,
        maxEntries: 100,
      }) as Record<string, unknown>,
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
