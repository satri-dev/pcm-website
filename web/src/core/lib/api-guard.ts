import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "./auth"

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>

export type ApiGuardResult =
  | { ok: true; session: Session }
  | { ok: false; response: NextResponse }

/**
 * Guard for API route handlers. Returns the session or an error response.
 * @param allowedRoles Optional list of roles permitted to proceed
 * (e.g. ["admin", "editor"]). Omit to allow any authenticated user.
 */
export async function requireApiSession(
  allowedRoles?: readonly string[]
): Promise<ApiGuardResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    }
  }

  if (allowedRoles) {
    const userRoles = (session.user.role ?? "")
      .split(/\s+/)
      .filter(Boolean)
    if (!userRoles.some((role) => allowedRoles.includes(role))) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        ),
      }
    }
  }

  return { ok: true, session }
}
