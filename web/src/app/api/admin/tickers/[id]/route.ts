import { NextResponse } from "next/server";
import { getTickerById, updateTicker, deleteTicker } from "@/repositories/ticker.repository";
import type { TickerUpdateInput } from "@/types/ticker";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticker = await getTickerById(id);
    if (!ticker) {
      return NextResponse.json({ error: "Ticker not found" }, { status: 404 });
    }
    return NextResponse.json(ticker);
  } catch (error) {
    console.error("Failed to fetch ticker:", error);
    return NextResponse.json({ error: "Failed to fetch ticker" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: TickerUpdateInput = await request.json();
    const success = await updateTicker(id, body);
    if (!success) {
      return NextResponse.json({ error: "Ticker not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update ticker:", error);
    return NextResponse.json({ error: "Failed to update ticker" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteTicker(id);
    if (!success) {
      return NextResponse.json({ error: "Ticker not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete ticker:", error);
    return NextResponse.json({ error: "Failed to delete ticker" }, { status: 500 });
  }
}
