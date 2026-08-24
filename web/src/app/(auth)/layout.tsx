import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { default: "PCM Admin", template: "%s · PCM Admin" },
  description: "Pokhara College of Mgmt — website content management.",

  icons: { icon: [{ url: "/favicon.ico", type: "image/x-icon" }] },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#f0f2fa] via-[#e6e9f5] to-[#d9deee] px-4 py-12 text-slate-900 antialiased">
      {children}
    </div>
  );
}
