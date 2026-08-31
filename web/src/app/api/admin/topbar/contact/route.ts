import { NextResponse } from "next/server";
import { getTopBarContact, updateTopBarContact } from "@/repositories/topbar.repository";
import type { TopBarContactUpdateInput } from "@/types/topbar";

export async function GET() {
  try {
    const contact = await getTopBarContact();
    return NextResponse.json(contact);
  } catch (error) {
    console.error("Failed to fetch topbar contact:", error);
    return NextResponse.json({ error: "Failed to fetch topbar contact" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body: TopBarContactUpdateInput = await request.json();
    const contact = await updateTopBarContact(body);
    
    if (!contact) {
      return NextResponse.json({ error: "TopBar contact not found" }, { status: 404 });
    }
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error("Failed to update topbar contact:", error);
    return NextResponse.json({ error: "Failed to update topbar contact" }, { status: 500 });
  }
}
