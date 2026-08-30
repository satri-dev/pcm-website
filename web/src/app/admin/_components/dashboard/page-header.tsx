"use client";

import { Eye, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/core/lib/auth-client";

interface SiteSettings {
  collegeName: string;
  logoUrl: string;
}

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const router = useRouter();
  const [siteName, setSiteName] = useState("PCM");

  useEffect(() => {
    fetch("/api/admin/system/settings")
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data: SiteSettings | null) => {
        if (data?.collegeName) setSiteName(data.collegeName);
      })
      .catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    document.body.classList.toggle("admin-sidebar-open");
  }, []);

  const closeSidebar = useCallback(() => {
    document.body.classList.remove("admin-sidebar-open");
  }, []);

  const handleSignOut = useCallback(async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }, [router]);

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
          <div className="admin-topbar__crumb">{siteName} Admin &middot; {subtitle}</div>
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

        <button
          type="button"
          onClick={handleSignOut}
          className="admin-icon-btn"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
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