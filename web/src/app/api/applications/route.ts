import { NextRequest, NextResponse } from "next/server";
import {
  createApplication,
  ensureApplicationIndexes,
} from "@/repositories/application.repository";
import { getPageContentBySlug } from "@/repositories/page-content.repository";
import type { AdmissionPageContent } from "@/types/page-content";
import {
  type FieldDef,
  validateFieldValue,
  validateObtainedVsFullMarks,
} from "@/lib/application-validation";

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
  const gender = typeof body.gender === "string" ? body.gender.trim() : "";
  const dob = typeof body.dob === "string" ? body.dob.trim() : "";

  if (!name) {
    return NextResponse.json(
      { success: false, error: "Name is required." },
      { status: 400 }
    );
  }
  if (!email) {
    return NextResponse.json(
      { success: false, error: "Email is required." },
      { status: 400 }
    );
  }
  if (!phone) {
    return NextResponse.json(
      { success: false, error: "Phone number is required." },
      { status: 400 }
    );
  }
  if (!gender) {
    return NextResponse.json(
      { success: false, error: "Gender is required." },
      { status: 400 }
    );
  }
  if (!dob) {
    return NextResponse.json(
      { success: false, error: "Date of birth is required." },
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

  if (!/^\d+$/.test(phone)) {
    return NextResponse.json(
      { success: false, error: "Phone number must contain only digits." },
      { status: 400 }
    );
  }
  if (phone.length !== 10) {
    return NextResponse.json(
      { success: false, error: "Phone number must be exactly 10 digits." },
      { status: 400 }
    );
  }

  if (dob) {
    const dobDate = new Date(dob);
    if (!isNaN(dobDate.getTime())) {
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      if (age < 16) {
        return NextResponse.json(
          { success: false, error: "You must be at least 16 years old." },
          { status: 400 }
        );
      }
    }
  }

  const documents = Array.isArray(body.documents)
    ? (body.documents as string[])
    : [];
  const paymentSlips = Array.isArray(body.paymentSlips)
    ? (body.paymentSlips as string[])
    : [];

  if (documents.length === 0) {
    return NextResponse.json(
      { success: false, error: "Please upload at least one required document." },
      { status: 400 }
    );
  }
  if (paymentSlips.length === 0) {
    return NextResponse.json(
      { success: false, error: "Please upload the transaction / payment slip." },
      { status: 400 }
    );
  }

  // Validate all required fields AND domain rules against the admission page
  // field config (same logic as the per-step validate endpoint).
  if (body.form && typeof body.form === "object") {
    const formData = body.form as Record<string, unknown>;

    const phoneVal =
      typeof formData.phone === "string" ? formData.phone.trim() : "";
    if (phoneVal && !/^\d+$/.test(phoneVal)) {
      return NextResponse.json(
        { success: false, error: "Phone number must contain only digits." },
        { status: 400 }
      );
    }
    if (phoneVal && phoneVal.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Phone number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    const dobVal =
      typeof formData.dob === "string" ? formData.dob.trim() : "";
    if (dobVal) {
      const dobDate = new Date(dobVal);
      if (!isNaN(dobDate.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
          age--;
        }
        if (age < 16) {
          return NextResponse.json(
            { success: false, error: "You must be at least 16 years old." },
            { status: 400 }
          );
        }
      }
    }

    try {
      const doc = await getPageContentBySlug("admission");
      const pageContent = (doc?.content as unknown as AdmissionPageContent) || null;
      if (pageContent?.applicationForm) {
        const af = pageContent.applicationForm;
        const allFields: FieldDef[] = [
          ...(af.personalInfoFields || []),
          ...(af.contactInfoFields || []),
          ...(af.academicInfoFields || []),
        ];

        for (const field of allFields) {
          const err = validateFieldValue(field, formData[field.id]);
          if (err) {
            return NextResponse.json(
              { success: false, error: err },
              { status: 400 }
            );
          }
        }

        const crossFieldErrors = validateObtainedVsFullMarks(
          af.academicInfoFields || [],
          formData
        );
        if (crossFieldErrors.length > 0) {
          return NextResponse.json(
            { success: false, error: crossFieldErrors[0] },
            { status: 400 }
          );
        }
      }
    } catch {
      // If we can't fetch page content, skip field-level validation
    }
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
        documents,
        paymentSlips,
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
