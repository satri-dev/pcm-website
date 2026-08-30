import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./_components/login-form";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to manage the website content.",
};

export default function LoginPage() {
  return (
    <main className="w-full max-w-sm">
      <section className="rounded-2xl border border-slate-200/70 bg-[#f8f9fc] px-7 py-9 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.25)] sm:px-9">
        {/* Brand */}
        <header className="flex items-center justify-center gap-3">
          <Image
            src="/logo-pcm.png"
            alt="PCM Logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="text-lg font-extrabold tracking-tight text-slate-900">
              PCM ADMIN
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Pokhara College of Mgmt
            </p>
          </div>
        </header>

        {/* Heading */}
        <div className="mt-7 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Sign in to manage the website content.
          </p>
        </div>

        {/* Interactive part (client component) */}
        <LoginForm />

        {/* Demo credentials */}
        <p className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-100/80 px-4 py-3 text-center text-xs leading-5 text-slate-600">
          Demo —{" "}
          <span className="font-semibold text-blue-800">admin/admin123</span>
          {" · "}
          <span className="font-semibold text-blue-800">editor/editor123</span>
          {" · "}
          <span className="font-semibold text-blue-800">viewer/viewer123</span>
        </p>

        {/* Back to website */}
        <Link
          href="/"
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          <span aria-hidden="true">←</span> Back to website
        </Link>
      </section>
    </main>
  );
}


