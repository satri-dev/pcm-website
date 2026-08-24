import { Metadata } from "next";
import { TwoFactorForm } from "./_components/two-factor-form";

export const metadata: Metadata = {
  title: "2FA Authentication",
  description: "Secure More Your Account with Two-Factor Authentication",
};

// Guarantees the page is prerendered at build time.
export const dynamic = "force-static";

export default function TwoFactorPage() {
  return (
    <main className="w-full max-w-sm">
      <section className="rounded-2xl border border-slate-200/70 bg-[#f8f9fc] px-7 py-9 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.25)] sm:px-9">
        <div className="mt-7 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Two-Factor Authentication
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Enter the 6-digit code from your authenticator app.
          </p>
        </div>
        <TwoFactorForm />
      </section>
    </main>
  );
}
