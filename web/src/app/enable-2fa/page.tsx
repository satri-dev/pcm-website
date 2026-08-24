"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/core/lib/auth-client"
import Image from "next/image"

export default function Enable2FAPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [totpURI, setTotpURI] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verifyCode, setVerifyCode] = useState("")
  const [status, setStatus] = useState("")
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await authClient.getSession()
      if (data?.user?.twoFactorEnabled) {
        router.push("/admin")
      }
    }
    checkSession()
  }, [router])

  const handleEnable = async () => {
    setIsPending(true)
    setStatus("")
    try {
      const { data, error } = await authClient.twoFactor.enable({
        password,
        method: "totp",
      })
      if (error) {
        setStatus(`Error: ${error.message}`)
      } else if (data) {
        if (data.method === "totp") {
          setTotpURI(data.totpURI)
          setBackupCodes(data.backupCodes)
        }
        setStatus("2FA enabled! Scan the QR code below, then enter the verification code.")
      }
    } catch (e) {
      setStatus(`Error: ${e}`)
    }
    setIsPending(false)
  }

  const handleVerify = async () => {
    setIsPending(true)
    setStatus("")
    try {
      const { error } = await authClient.twoFactor.verifyTotp({
        code: verifyCode,
        trustDevice: true,
      })
      if (error) {
        setStatus(`Error: ${error.message}`)
      } else {
        router.push("/admin")
      }
    } catch (e) {
      setStatus(`Error: ${e}`)
    }
    setIsPending(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-3xl rounded-3xl border border-slate-200/80 bg-white px-6 py-8 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.18)] sm:px-10 lg:px-12">
        <header className="flex items-center justify-center gap-3">
          <Image src="/logo-pcm.png" alt="PCM Logo" width={40} height={40} className="h-10 w-10 rounded-full" />
          <div className="text-center">
            <p className="text-lg font-extrabold tracking-tight text-slate-900">PCM ADMIN</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Pokhara College of Mgmt</p>
          </div>
        </header>

        <div className="mt-7 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Enable Two-Factor Authentication</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Secure your account with an authenticator app.
          </p>
        </div>

        <div className="mt-7 space-y-5">
          {!totpURI && (
            <div className="space-y-1.5 text-left">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-800">Current Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                placeholder="Enter your password"
                className="block h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-800/15"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {!totpURI && (
            <button
              onClick={handleEnable}
              disabled={isPending}
              className="h-11 w-full rounded-lg bg-blue-800 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Setting up…" : "Enable 2FA"}
            </button>
          )}

          {totpURI && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700 shadow-sm">
                  <p className="mb-3 text-center text-sm font-medium text-slate-700">Scan this QR code with Google Authenticator / Authy:</p>
                  <div className="flex items-center justify-center rounded-xl bg-white p-4 shadow-inner ring-1 ring-slate-100">
                    <Image
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(totpURI)}`}
                      alt="2FA QR Code"
                      width={280}
                      height={280}
                      className="block w-44 h-44 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-lg"
                      unoptimized
                    />
                  </div>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Setup key</p>
                  <code className="mt-2 block w-full break-all rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-[11px] text-slate-800">{totpURI}</code>
                </div>

                {backupCodes.length > 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700 shadow-sm">
                    <p className="mb-2 text-center text-sm font-medium text-slate-800">Backup Codes</p>
                    <p className="mb-3 text-center text-xs text-slate-600">Save these somewhere safe. You can use them if you lose access to your authenticator app.</p>
                    <div className="max-h-56 overflow-auto">
                      <ul className="list-inside list-disc space-y-1 text-left text-xs text-slate-700">
                        {backupCodes.map((code, i) => (
                          <li key={i} className="select-text">{code}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="hidden md:block" />
                )}
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="code" className="block text-sm font-semibold text-slate-800">Verification Code</label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  required
                  placeholder="123456"
                  className="block h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-800/15"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                />
              </div>

              <button
                onClick={handleVerify}
                disabled={isPending}
                className="h-11 w-full rounded-lg bg-green-700 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Verifying…" : "Verify & Continue"}
              </button>
            </>
          )}

          {status && (
            <p
              className={`rounded-lg border px-3 py-2 text-center text-sm ${
                status.startsWith("Error")
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-green-200 bg-green-50 text-green-700"
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
