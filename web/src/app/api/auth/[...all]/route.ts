// src/app/api/auth/[...all]/route.ts

import { getAuthInstance } from "@/core/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Lazy handlers that wait for auth instance
export async function GET(request: Request) {
  const auth = await getAuthInstance();
  const handler = toNextJsHandler(auth);
  return handler.GET(request);
}

export async function POST(request: Request) {
  const auth = await getAuthInstance();
  const handler = toNextJsHandler(auth);
  return handler.POST(request);
}
