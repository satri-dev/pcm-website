import type { DeviceType } from "./types"

export function detectDevice(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase()

  if (
    /ipad|tablet|playbook|silk|android(?!.*mobile)/i.test(ua)
  ) {
    return "tablet"
  }

  if (
    /mobile|iphone|ipod|android|blackberry|windows phone/i.test(ua)
  ) {
    return "mobile"
  }

  return "desktop"
}