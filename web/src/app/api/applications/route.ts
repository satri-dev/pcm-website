import { NextRequest, NextResponse } from "next/server";
import {
  createApplication,
  ensureApplicationIndexes,
} from "@/repositories/application.repository";

/**
 * POST /api/applications
 * Public endpoint used by the admission form to submit an application.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  if (!name || !email || !phone) {
    return NextResponse.json(
      { success: false, error: "Name, email and phone are required." },
      { status: 400 }
    );
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return NextResponse.json(
      { success: false, error: "Invalid email address." },
      { status: 400 }
    );
  }

  try {
    await ensureApplicationIndexes();
    const created = await createApplication({
      name,
      email,
      phone,
      program: typeof body.program === "string" ? body.program : "",
      shift: typeof body.shift === "string" ? body.shift : "",
      status: "new",
      data: {
        program: typeof body.program === "string" ? body.program : "",
        shift: typeof body.shift === "string" ? body.shift : "",
        name,
        gender: typeof body.gender === "string" ? body.gender : "",
        dob: typeof body.dob === "string" ? body.dob : "",
        dateOption: typeof body.dateOption === "string" ? body.dateOption : "",
        nationality: typeof body.nationality === "string" ? body.nationality : "",
        phone,
        email,
        documents: Array.isArray(body.documents)
          ? (body.documents as string[])
          : [],
        paymentSlips: Array.isArray(body.paymentSlips)
          ? (body.paymentSlips as string[])
          : [],
        agreedToTerms: !!body.agreedToTerms,
        // Preserve the complete dynamic form state (every field from every
        // step, keyed by field id) so nothing is lost on submission.
        form:
          body.form && typeof body.form === "object"
            ? (body.form as Record<string, unknown>)
            : {},
      },
    });

    return NextResponse.json(
      { success: true, reference: created.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[applications] Failed to save application:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
