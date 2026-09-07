import Link from "next/link";
import {
  Pencil,
  ExternalLink,
} from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-[1.35rem] font-bold text-(--admin-ink) m-0 leading-tight">
          Dashboard
        </h1>
        <p className="text-[0.9rem] text-(--admin-muted) m-0 mt-0.5">
          Analytics and quick overview of the PCM website content.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn--ghost"
        >
          <ExternalLink size={16} />
          Back to Website
        </Link>

        <Link href="admin/content/news" className="admin-btn admin-btn--primary">
          <Pencil size={16} />
          New Post
        </Link>
      </div>
    </div>
  );
}
