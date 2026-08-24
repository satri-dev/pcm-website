import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/core/lib/auth";
import { getDb } from "@/core/lib/db";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, username } = body;

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, password, and username are required" },
        { status: 400 }
      );
    }

    // Use better-auth's signup API to create user properly
    // This creates both user and account records automatically
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: username,
        username, // Username plugin will handle this
      },
    });

    // The result contains user object directly, not wrapped in data/error
    if (!result || !result.user) {
      return NextResponse.json(
        { error: "Failed to create admin user" },
        { status: 400 }
      );
    }

    // Update the role to admin after creation
    // Better-auth doesn't allow setting role during signup for security
    const db = await getDb();
    await db.collection("user").updateOne(
      { _id: new ObjectId(result.user.id) },
      { $set: { role: "admin" } }
    );

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      userId: result.user.id,
      credentials: {
        email,
        username,
        role: "admin",
      },
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error seeding admin:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed admin user" },
      { status: 500 }
    );
  }
}
