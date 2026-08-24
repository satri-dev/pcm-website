import { createAuthClient } from "better-auth/react"
import { adminClient, usernameClient, twoFactorClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    usernameClient(),
    twoFactorClient({
      twoFactorPage: "/two-factor",
    }),
  ],
})
