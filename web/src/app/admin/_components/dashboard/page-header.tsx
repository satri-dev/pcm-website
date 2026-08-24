"use client";

import { Eye, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const toggle = useCallback(() => {
    document.body.classList.toggle("admin-sidebar-open");
  }, []);

  const closeSidebar = useCallback(() => {
    document.body.classList.remove("admin-sidebar-open");
  }, []);

  return (
    <>
      <div className="admin-topbar">
        <button
          type="button"
          className="admin-burger"
          aria-label="Toggle sidebar"
          onClick={toggle}
        >
          <Menu size={18} />
        </button>

        <div style={{ minWidth: 0 }}>
          <div className="admin-topbar__title">{title}</div>
          <div className="admin-topbar__crumb">PCM Admin &middot; {subtitle}</div>
        </div>

        <div className="admin-topbar__spacer" />

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-icon-btn"
          aria-label="Preview site"
          title="Preview site"
        >
          <Eye size={18} />
        </Link>

        <form action="/api/auth/sign-out" method="POST" style={{ display: "contents" }}>
          <button type="submit" className="admin-icon-btn" aria-label="Sign out" title="Sign out">
            <LogOut size={18} />
          </button>
        </form>
      </div>

      <div
        className="admin-sidebar-scrim"
        onClick={closeSidebar}
        onKeyDown={(e) => {
          if (e.key === "Escape") closeSidebar();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close sidebar"
        style={{ cursor: "pointer" }}
      />
    </>
  );
}
