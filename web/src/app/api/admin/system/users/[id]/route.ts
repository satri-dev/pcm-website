import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/core/lib/api-guard";
import { getDb } from "@/core/lib/db";
import {
  USER_COLLECTION,
  ACCOUNT_COLLECTION,
  SESSION_COLLECTION,
  userFromDocument,
  accountFromDocument,
  type UserDocument,
  type AccountDocument,
} from "@/app/admin/system/users/types";
import { ObjectId } from "mongodb";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  role: z.enum(["admin", "editor", "viewer"]).optional(),
  password: z.string().min(6).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const db = await getDb();

  let userDoc: UserDocument | null;
  try {
    userDoc = await db
      .collection<UserDocument>(USER_COLLECTION)
      .findOne({ _id: new ObjectId(id) });
  } catch {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  if (!userDoc) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Fetch associated accounts
  const accountDocs = await db
    .collection(ACCOUNT_COLLECTION)
    .find({ userId: id })
    .toArray();

  const user = userFromDocument(userDoc);
  const accounts = accountDocs.map((doc) =>
    accountFromDocument(doc as AccountDocument)
  );

  return NextResponse.json({ user, accounts });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const db = await getDb();
  const col = db.collection<UserDocument>(USER_COLLECTION);

  // Verify user exists
  let existing: UserDocument | null;
  try {
    existing = await col.findOne({ _id: new ObjectId(id) });
  } catch {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Ban action
  if (action === "ban") {
    // Prevent banning self
    const session = guard.session;
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "You cannot ban yourself" },
        { status: 400 }
      );
    }

    await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: { banned: true, updatedAt: new Date() } }
    );

    const updated = await col.findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updated ? userFromDocument(updated) : null);
  }

  // Unban action
  if (action === "unban") {
    await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: { banned: false, updatedAt: new Date() } }
    );

    const updated = await col.findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updated ? userFromDocument(updated) : null);
  }

  // Regular update
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 422 });
  }

  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const updates = parsed.data;

  // Check unique email (if changing)
  if (updates.email) {
    const emailLower = updates.email.toLowerCase();
    if (emailLower !== existing.email.toLowerCase()) {
      const dup = await db
        .collection(USER_COLLECTION)
        .findOne({ email: emailLower, _id: { $ne: new ObjectId(id) } });
      if (dup) {
        return NextResponse.json(
          { error: "A user with this email already exists" },
          { status: 409 }
        );
      }
    }
  }

  // Check unique username (if changing)
  if (updates.username) {
    const usernameLower = updates.username.toLowerCase();
    if (usernameLower !== existing.username.toLowerCase()) {
      const dup = await db
        .collection(USER_COLLECTION)
        .findOne({ username: usernameLower, _id: { $ne: new ObjectId(id) } });
      if (dup) {
        return NextResponse.json(
          { error: "A user with this username already exists" },
          { status: 409 }
        );
      }
    }
  }

  const setFields: Record<string, unknown> = { updatedAt: new Date() };
  if (updates.name) setFields.name = updates.name;
  if (updates.email) setFields.email = updates.email.toLowerCase();
  if (updates.username) setFields.username = updates.username.toLowerCase();
  if (updates.role) setFields.role = updates.role;

  // Handle password change via better-auth if provided
  if (updates.password) {
    // We'll update the password in the account collection directly
    // by rehashing and setting it
    const { hash } = await import("bcrypt");
    const newHash = await hash(updates.password, 10);
    await db.collection(ACCOUNT_COLLECTION).updateOne(
      { userId: id, providerId: "credential" },
      { $set: { password: newHash } }
    );
  }

  await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: setFields }
  );

  const updated = await col.findOne({ _id: new ObjectId(id) });
  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(userFromDocument(updated));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const db = await getDb();
  const col = db.collection<UserDocument>(USER_COLLECTION);

  // Verify user exists
  let existing: UserDocument | null;
  try {
    existing = await col.findOne({ _id: new ObjectId(id) });
  } catch {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Prevent deleting self
  const session = guard.session;
  if (session.user.id === id) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  // Prevent deleting last admin
  if (existing.role === "admin") {
    const adminCount = await col.countDocuments({
      role: "admin",
      _id: { $ne: new ObjectId(id) },
    });
    if (adminCount === 0) {
      return NextResponse.json(
        { error: "Cannot delete the last admin user" },
        { status: 400 }
      );
    }
  }

  // Hard delete: user + account + session
  // Do NOT delete twoFactor or verification
  const userId = id;
  await Promise.all([
    col.deleteOne({ _id: new ObjectId(id) }),
    db.collection(ACCOUNT_COLLECTION).deleteMany({ userId }),
    db.collection(SESSION_COLLECTION).deleteMany({ userId }),
  ]);

  return NextResponse.json({ success: true });
}
