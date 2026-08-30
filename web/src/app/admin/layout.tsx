import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminShell from "./_components/dashboard/admin-shell";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · PCM Admin" },
  description:
    "Website content management system.",
};

// Admin pages block on per-request DB + session reads. Opt the whole admin
// segment out of Cache Components static-shell validation.
export const instant = false;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--admin-bg)",
        fontFamily: '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
