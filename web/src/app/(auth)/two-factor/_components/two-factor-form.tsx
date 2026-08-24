"use client"

import { useState, useTransition, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/core/lib/auth-client"

export function TwoFactorForm() {
  const [code, setCode] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    startTransition(async () => {
      setFormError(null)
      const { error } = await authClient.twoFactor.verifyTotp({
        code,
        trustDevice: true,
      })
      if (error) {
        setFormError(error.message || "Invalid verification code")
      } else {
        router.push("/admin")
        router.refresh()
      }
    })
  }

  const inputClasses =
    "block h-11 w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-800/15"

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="code" className="block text-sm font-semibold text-slate-800">
          Verification Code
        </label>
        <input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          autoFocus
          required
          placeholder="123456"
          className={`${inputClasses} px-3.5`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      {formError && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
        >
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="h-11 w-full rounded-lg bg-blue-800 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Verifying…" : "Verify"}
      </button>
    </form>
  )
}
