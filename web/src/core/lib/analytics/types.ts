export type DeviceType =
  | "desktop"
  | "mobile"
  | "tablet"

export interface AnalyticsVisit {
  visitorId: string
  sessionId: string

  path: string

  deviceType: DeviceType

  userAgent?: string
  referrer?: string | null

  ipHash?: string

  createdAt: Date
  date: string
}