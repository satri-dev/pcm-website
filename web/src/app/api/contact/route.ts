import { NextRequest, NextResponse } from "next/server";

// This is a write endpoint — never cache it.
export const dynamic = "force-dynamic";

/**
 * POST /api/contact
 *
 * Demo endpoint — logs the payload and returns a success response.
 * When the backend is ready, replace the body with:
 *   - Save to MongoDB via the contact repository
 *   - Send a notification email (e.g. Nodemailer / Resend)
 */

interface ContactPayload {
  fullName: string;
  phone?: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactPayload = await req.json();

    // Basic server-side validation
    if (!body.fullName?.trim() || !body.email?.trim() || !body.message?.trim()) {
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

    console.log("[contact] New enquiry:", {
      from: body.email,
      name: body.fullName,
      subject: body.subject,
      messageLength: body.message.length,
    });

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
