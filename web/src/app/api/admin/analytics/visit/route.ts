import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

import clientPromise from "@/core/lib/mongodb"
import { detectDevice } from "@/core/lib/analytics/device"

const VISITOR_COOKIE = "analytics_visitor_id"
const SESSION_COOKIE = "analytics_session_id"

const SESSION_DURATION = 30 * 60 // 30 minutes

function generateId() {
  return crypto.randomUUID()
}

function hashIp(ip: string) {
  return crypto
    .createHash("sha256")
    .update(`${ip}${process.env.MONGODB_URI}`)
    .digest("hex")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const path =
      typeof body.path === "string"
        ? body.path.slice(0, 500)
        : "/"

    const referrer =
      typeof body.referrer === "string"
        ? body.referrer.slice(0, 1000)
        : null

    const userAgent =
      request.headers.get("user-agent") || ""

    const deviceType = detectDevice(userAgent)

    let visitorId =
      request.cookies.get(VISITOR_COOKIE)?.value

    let sessionId =
      request.cookies.get(SESSION_COOKIE)?.value

    const isNewVisitor = !visitorId
    const isNewSession = !sessionId

    if (!visitorId) {
      visitorId = generateId()
    }

    if (!sessionId) {
      sessionId = generateId()
    }

    const forwardedFor =
      request.headers.get("x-forwarded-for")

    const realIp =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown"

    const ipHash =
      realIp !== "unknown"
        ? hashIp(realIp)
        : undefined

    const now = new Date()

    const date = now.toISOString().slice(0, 10)

    const client = await clientPromise

    const db = client.db(
      process.env.MONGODB_DB
    )

    await db.collection("analytics_visits").insertOne({
      visitorId,
      sessionId,
      path,
      deviceType,
      userAgent,
      referrer,
      ipHash,
      date,
      createdAt: now,
    })

    const response = NextResponse.json({
      success: true,
    })

    if (isNewVisitor) {
      response.cookies.set({
        name: VISITOR_COOKIE,
        value: visitorId,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      })
    }

    if (isNewSession) {
      response.cookies.set({
        name: SESSION_COOKIE,
        value: sessionId,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_DURATION,
        path: "/",
      })
    }

    return response
  } catch (error) {
    console.error(
      "Analytics visit error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    )
  }
}