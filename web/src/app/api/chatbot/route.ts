import { NextResponse } from "next/server";
import { getPublicChatbotData } from "@/lib/data/chatbot";

// Public chatbot knowledge base. Intentionally NOT protected — this is the
// read path served to the public ChatbotWidget. It never touches MongoDB
// directly; data is cached by getPublicChatbotData (Cache Components/ISR)
// and only refreshed in the background or via revalidateTag when admins
// update chatbot entries.
export async function GET() {
  const payload = await getPublicChatbotData();

  return NextResponse.json(payload);
}
