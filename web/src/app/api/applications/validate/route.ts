import { NextRequest, NextResponse } from "next/server";
import { getPageContentBySlug } from "@/repositories/page-content.repository";
import type { AdmissionPageContent } from "@/types/page-content";
import type { FileEntry } from "@/types/application";
import {
  type FieldDef,
  normalizeValue,
  validateFieldValue,
  validateObtainedVsFullMarks,
} from "@/lib/application-validation";

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

  const step = Number(body.step);
  const form = body.form as Record<string, unknown> | undefined;
  const documents = body.documents as FileEntry[] | undefined;
  const paymentSlips = body.paymentSlips as FileEntry[] | undefined;

  if (isNaN(step) || step < 0 || step > 5) {
    return NextResponse.json(
      { success: false, error: "Invalid step number" },
      { status: 400 }
    );
  }

  if (!form || typeof form !== "object") {
    return NextResponse.json(
      { success: false, error: "Form data is required" },
      { status: 400 }
    );
  }

  let pageContent: AdmissionPageContent | null;
  try {
    const doc = await getPageContentBySlug("admission");
    pageContent = (doc?.content as unknown as AdmissionPageContent) || null;
  } catch {
    return NextResponse.json(
      { valid: true, errors: [] },
      { status: 200 }
    );
  }

  if (!pageContent?.applicationForm) {
    return NextResponse.json(
      { valid: true, errors: [] },
      { status: 200 }
    );
  }

  const af = pageContent.applicationForm;
  const errors: string[] = [];

  switch (step) {
    case 0: {
      const fields = af.personalInfoFields || [];
      for (const field of fields) {
        const err = validateFieldValue(field as unknown as FieldDef, form[field.id]);
        if (err) errors.push(err);
      }
      break;
    }
    case 1: {
      const fields = af.contactInfoFields || [];
      for (const field of fields) {
        const err = validateFieldValue(field as unknown as FieldDef, form[field.id]);
        if (err) errors.push(err);
      }
      break;
    }
    case 2: {
      const fields = af.academicInfoFields || [];
      for (const field of fields) {
        const err = validateFieldValue(field as unknown as FieldDef, form[field.id]);
        if (err) errors.push(err);
      }
      errors.push(
        ...validateObtainedVsFullMarks(fields as unknown as FieldDef[], form)
      );
      break;
    }
    case 3: {
      // Document upload step — check against CMS-configured document count
      const docs = Array.isArray(documents) ? documents : [];
      const filledCount = docs.filter((d) => {
        const url = typeof d === "string" ? d : d.url;
        return normalizeValue(url);
      }).length;
      const expectedCount = (pageContent as any)?.applicationForm?.documentStep?.documentLabels?.length ?? 0;
      if (expectedCount > 0 && filledCount < expectedCount) {
        errors.push(`Please upload all ${expectedCount} required documents (${filledCount}/${expectedCount} uploaded)`);
      } else if (filledCount === 0) {
        errors.push("Please upload at least one required document");
      }
      break;
    }
    case 4: {
      if (!form.agree_terms) {
        errors.push("You must agree to the declaration before proceeding");
      }
      break;
    }
    case 5: {
      // Payment step
      const slips = Array.isArray(paymentSlips) ? paymentSlips : [];
      const count = slips.filter((s) => {
        const url = typeof s === "string" ? s : s.url;
        return normalizeValue(url);
      }).length;
      if (count === 0) {
        errors.push("Please upload the transaction / payment slip");
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json(
    { valid: errors.length === 0, errors },
    { status: 200 }
  );
}
