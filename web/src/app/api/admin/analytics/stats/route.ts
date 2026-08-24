import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { getSiteVisits } from "@/core/lib/analytics/stats"
import { auth } from "@/core/lib/auth"

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    const data = await getSiteVisits(60)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        data: [],
      },
      {
        status: 500,
      }
    )
  }
}