import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/core/lib/api-guard";
import { getDb } from "@/core/lib/db";
import { auth } from "@/core/lib/auth";
import {
  SETTINGS_COLLECTION,
  siteSettingsFromDocument,
  type SiteSettingsDocument,
} from "@/app/admin/system/settings/types/settings";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { hash, compare } from "bcrypt";

const updateSiteSettingsSchema = z.object({
  collegeName: z.string().min(1, "College name is required").max(200),
  logoUrl: z.string().url("Invalid logo URL").max(500),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  totpCode: z.string().length(6, "TOTP code must be 6 digits"),
});

// GET: Fetch site settings
export async function GET() {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const db = await getDb();
  const col = db.collection<SiteSettingsDocument>(SETTINGS_COLLECTION);
  
  const doc = await col.findOne({ key: "site" });
  if (!doc) {
    // Return default settings
    return NextResponse.json({
      collegeName: "PCM",
      logoUrl: "/logo-pcm.png",
      updatedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json(siteSettingsFromDocument(doc));
}

// PUT: Update site settings
export async function PUT(req: NextRequest) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 422 });
  }

  const parsed = updateSiteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { collegeName, logoUrl } = parsed.data;
  const db = await getDb();
  const col = db.collection<SiteSettingsDocument>(SETTINGS_COLLECTION);

  const now = new Date();
  await col.updateOne(
    { key: "site" },
    {
      $set: {
        value: { collegeName, logoUrl },
        updatedAt: now,
      },
      $setOnInsert: {
        key: "site",
        createdAt: now,
      },
    },
    { upsert: true }
  );

  return NextResponse.json({
    collegeName,
    logoUrl,
    updatedAt: now.toISOString(),
  });
}

// POST: Change password with TOTP verification
export async function POST(req: NextRequest) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 422 });
  }

  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { currentPassword, newPassword, totpCode } = parsed.data;
  const db = await getDb();

  // Verify TOTP code using better-auth
  try {
    await auth.api.verifyTOTP({
      body: {
        code: totpCode,
      },
      headers: req.headers,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid TOTP code";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }

  // Get user account to verify current password
  const accountCol = db.collection("account");
  const account = await accountCol.findOne({
    userId: new ObjectId(guard.session.user.id),
    providerId: "credential",
  });

  if (!account || !account.password) {
    return NextResponse.json(
      { error: "Account not found" },
      { status: 400 }
    );
  }

  // Verify current password
  const isValid = await compare(currentPassword, account.password);
  if (!isValid) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 }
    );
  }

  // Hash new password
  const hashedPassword = await hash(newPassword, 10);

  // Update password
  await accountCol.updateOne(
    { _id: account._id },
    { $set: { password: hashedPassword } }
  );

  return NextResponse.json({
    success: true,
    message: "Password updated successfully",
  });
}