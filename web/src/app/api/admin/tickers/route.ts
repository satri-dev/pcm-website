import { NextResponse } from "next/server";
import { createTicker, listAllTickers } from "@/repositories/ticker.repository";
import type { TickerCreateInput } from "@/types/ticker";

export async function GET() {
  try {
    const tickers = await listAllTickers();
    return NextResponse.json(tickers);
  } catch (error) {
    console.error("Failed to fetch tickers:", error);
    return NextResponse.json({ error: "Failed to fetch tickers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: TickerCreateInput = await request.json();
    const id = await createTicker(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create ticker:", error);
    return NextResponse.json({ error: "Failed to create ticker" }, { status: 500 });
  }
}
