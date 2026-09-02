import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { requireApiSession } from "@/core/lib/api-guard";
import { 
  getAdmissionModal as getAdmissionModalRepo,
  updateAdmissionModal 
} from "@/repositories/admission-modal.repository";
import { AdmissionModalUpdateInput } from "@/types/admission-modal";

// Admin GET endpoint - no caching, always fetch fresh data
export async function GET() {
  const guard = await requireApiSession();
  if (!guard.ok) return guard.response;

  try {
    // Use repository directly (not cached data layer) for admin
    const data = await getAdmissionModalRepo();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch admission modal:", error);
    return NextResponse.json(
      { error: "Failed to fetch admission modal" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const guard = await requireApiSession(["admin", "editor"]);
  if (!guard.ok) return guard.response;

  try {
    const body = await req.json();
    const patch: AdmissionModalUpdateInput = {};

    if (body.settings !== undefined) {
      patch.settings = body.settings;
    }

    const updated = await updateAdmissionModal(patch);
    
    // Revalidate cache using tag
    revalidateTag(CACHE_TAGS.admissionModal, 'max');
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update admission modal:", error);
    return NextResponse.json(
      { error: "Failed to update admission modal" },
      { status: 500 }
    );
  }
}
