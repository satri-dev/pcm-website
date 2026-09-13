import { NextRequest, NextResponse } from "next/server";
import { guardPublicWrite } from "@/core/lib/rate-limit";
import { capString } from "@/lib/sanitize";

interface ContactPayload {
  fullName: string;
  phone?: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(req: NextRequest) {
  const limited = guardPublicWrite(req, { limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  try {
    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return NextResponse.json(
        { success: false, error: "Invalid request body." },
        { status: 400 }
      );
    }

    const b = raw as Record<string, unknown>;
    const body: ContactPayload = {
      fullName: capString(typeof b.fullName === "string" ? b.fullName.trim() : "", 200),
      phone: capString(typeof b.phone === "string" ? b.phone.trim() : "", 50),
      email: capString(typeof b.email === "string" ? b.email.trim() : "", 320),
      subject: capString(typeof b.subject === "string" ? b.subject.trim() : "", 500),
      message: capString(typeof b.message === "string" ? b.message.trim() : "", 20_000),
    };

    // Basic server-side validation
    if (!body.fullName || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: "Required fields are missing." },
        { status: 400 }
      );
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    // TODO: persist to DB + send notification email
    // await contactRepository.create(body);
    // await sendNotificationEmail(body);

    return NextResponse.json(
      { success: true, message: "Enquiry received. We'll be in touch soon." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
