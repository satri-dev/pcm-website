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

const db = await getDb()

export const auth = betterAuth({
  database: mongodbAdapter(db),
  appName: "PCM Admin",

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "pcm-admin",
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
