import type { ReactNode } from "react";
import AdminSidebar from "./admin-sidebar";

export default function AdminShell({
  children,
  activePath,
}: {
  children: ReactNode;
  activePath?: string;
}) {
  return (
    <div className="admin-shell">
      <AdminSidebar activePath={activePath} />
      <div className="admin-main">{children}</div>
    </div>
  );
}
