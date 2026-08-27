import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/core/lib/api-guard";
import { getDb } from "@/core/lib/db";
import { auth } from "@/core/lib/auth";
import {
  USER_COLLECTION,
  ACCOUNT_COLLECTION,
  userFromDocument,
  type UserDocument,
  type UserRole,
  USER_ROLES,
} from "@/app/admin/system/users/types";
import { ObjectId } from "mongodb";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["editor", "viewer"] as const),
});

export async function GET(req: NextRequest) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || "50")));
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const roleFilter = (searchParams.get("role") || "").trim();

  const db = await getDb();
  const col = db.collection<UserDocument>(USER_COLLECTION);

  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
    ];
  }
  if (roleFilter && (USER_ROLES as readonly string[]).includes(roleFilter)) {
    filter.role = roleFilter;
  }

  const [total, docs] = await Promise.all([
    col.countDocuments(filter),
    col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
  ]);

  const items = docs.map(userFromDocument);

  return NextResponse.json({
    items,
    total,
    page,
    pageSize,
    pages: Math.ceil(total / pageSize),
  });
}

export async function POST(req: NextRequest) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 422 });
  }

  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { name, email, username, password, role } = parsed.data;
  const db = await getDb();

  // Check unique email
  const existingEmail = await db
    .collection(USER_COLLECTION)
    .findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 409 }
    );
  }

  // Check unique username
  const existingUsername = await db
    .collection(USER_COLLECTION)
    .findOne({ username: username.toLowerCase() });
  if (existingUsername) {
    return NextResponse.json(
      { error: "A user with this username already exists" },
      { status: 409 }
    );
  }

  // Create user via better-auth (creates both user + account)
  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      username,
    },
  });

  if (!result || !result.user) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 400 }
    );
  }

  // Set the role (better-auth doesn't allow setting role during signup)
  await db.collection(USER_COLLECTION).updateOne(
    { _id: new ObjectId(result.user.id) },
    { $set: { role } }
  );

  // Fetch the created user to return
  const created = await db
    .collection<UserDocument>(USER_COLLECTION)
    .findOne({ _id: new ObjectId(result.user.id) });

  if (!created) {
    return NextResponse.json(
      { error: "User created but could not be fetched" },
      { status: 201 }
    );
  }

  return NextResponse.json(userFromDocument(created), { status: 201 });
}
