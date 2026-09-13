/* eslint-disable @typescript-eslint/no-explicit-any */
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { admin, username, twoFactor, haveIBeenPwned } from "better-auth/plugins"
import { createAccessControl } from "better-auth/plugins/access"
import { compare, hash } from "bcrypt"
import { nextCookies } from "better-auth/next-js"
import { getDb } from "./db"

const ac = createAccessControl({
  user:    ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "set-email", "get", "update"] as const,
  session: ["list", "revoke", "delete"] as const,
})

const adminRole  = ac.newRole({ user: ["create","list","set-role","ban","impersonate","delete","set-password","set-email","get","update"], session: ["list","revoke","delete"] })
const editorRole  = ac.newRole({ user: [], session: [] })
const viewerRole = ac.newRole({ user: [], session: [] })

let _auth: any = null

export async function getAuthInstance() {
  if (_auth) return _auth
  const db = await getDb()
  
  // Parse trusted origins from environment variable (comma-separated)
  const trustedOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(',').map(origin => origin.trim())
    : undefined
  
  _auth = betterAuth({
    database: mongodbAdapter(db),
    appName: "PCM Admin",
    
    // Explicit baseURL configuration for better origin validation
    baseURL: process.env.BETTER_AUTH_URL,
    
    // Trust additional origins from environment variable
    ...(trustedOrigins && { trustedOrigins }),

    advanced: {
      useSecureCookies: process.env.NODE_ENV === "production",
      cookiePrefix: "pcm-admin",
      rateLimit: {
        enabled: true,
        window: 60,
        max: 100,
        customRules: [
          { path: "/sign-in/email", window: 60, max: 5 },
          { path: "/sign-up/email", window: 60, max: 5 },
        ],
      },
    },

    session: {
      storeSessionInDatabase: true,
      updateAge: 24 * 60 * 60,
      expiresIn: 60 * 60 * 24 * 7,
    },

    emailAndPassword: {
      enabled: true,
      password: {
        hash: async (password) => {
          return await hash(password, 10)
        },
        verify: async ({ hash: passwordHash, password }) => {
          for (const candidate of [password]) {
            try {
              if (await compare(candidate, passwordHash)) return true
            } catch {}
          }
          return false
        },
      },
    },

    plugins: [
      admin({
        defaultRole: "viewer",
        ac,
        roles: {
          admin:   adminRole,
          viewer:  viewerRole,
          editor:  editorRole,
        },
      }),
      username({
        usernameValidator: (username: string) => {
          const regex = /^[a-zA-Z0-9_-]{3,50}$/
          return regex.test(username)
        },
      }),
      twoFactor({
        issuer: "PCM Admin",
      }),
      haveIBeenPwned({
        enabled: process.env.NODE_ENV === "production",
      }),
      nextCookies(),
    ],
  })
  return _auth
}

/**
 * Lazy proxy: the MongoDB connection is only established when an API method
 * is actually called at runtime, not at module-import / build time.
 * Handles the pattern `auth.api.<method>(args)` used throughout the codebase.
 */
export const auth = new Proxy({} as any, {
  get(_, prop) {
    if (prop === Symbol.for("nodejs.util.inspect.custom")) return undefined
    if (prop === "then") return undefined

    return new Proxy({} as any, {
      get(_, method) {
        if (method === "then") return undefined
        return (...args: unknown[]) =>
          getAuthInstance().then(
            (instance: any) => instance[prop][method](...args),
          )
      },
    })
  },
})
