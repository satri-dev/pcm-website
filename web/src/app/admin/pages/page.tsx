import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Calculator,
  ClipboardList,
  DoorOpen,
  Download,
  GraduationCap,
  Heart,
  Home,
  Images,
  Info,
  Layers,
  Mail,
  Megaphone,
  Newspaper,
  PenLine,
  Quote,
  Sparkles,
  BadgeCheck,
  PanelTop,
  PanelBottom,
  TrendingUp,
  MessageCircle,
  Ticket,
  LayoutList,
  BarChart3,
  Map,
  Users,
  Briefcase,
  Award,
  type LucideIcon,
} from "lucide-react";

import PageHeader from "../_components/dashboard/page-header";
import {
  mainPages,
  siteSections,
  type PagesSectionEntry,
} from "./_config";

export const metadata: Metadata = {
  title: "Pages & Sections",
  description:
    "Configure public website pages and reusable site sections such as navbar, footer, topbar, and CTAs.",
  robots: { index: false, follow: false },
};

const pageIcons: Record<string, LucideIcon> = {
  home: Home,
  about: Info,
  "about/board": Users,
  "about/message": MessageCircle,
  "about/faculty": GraduationCap,
  "about/facility": Layers,
  "about/campus-map": Map,
  admission: DoorOpen,
  alumni: GraduationCap,
  blogs: PenLine,
  "blog-student": BookOpen,
  clubs: Sparkles,
  contact: Mail,
  career: Briefcase,
  downloads: Download,
  events: Megaphone,
  gallery: Images,
  "gpa-converter": Calculator,
  life: Heart,
  news: Newspaper,
  "news-article": Newspaper,
  notices: ClipboardList,
  programs: Layers,
  results: BarChart3,
  testimonial: Quote,
  scholarship: Award,
};

const sectionIcons: Record<string, LucideIcon> = {
  navbar: PanelTop,
  topbar: LayoutList,
  footer: PanelBottom,
  cta: Megaphone,
  "apply-now": BadgeCheck,
  tickers: TrendingUp,
  "chat-widget": MessageCircle,
  "admission-modal": Ticket,
};

function EntryGrid({
  kind,
  entries,
  icons,
}: {
  kind: "page" | "section";
  entries: PagesSectionEntry[];
  icons: Record<string, LucideIcon>;
}) {
  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h3>{kind === "page" ? "Pages" : "Sections"}</h3>
        <span className="text-[0.8rem] text-[var(--admin-muted)]">
          {entries.length} configured
        </span>
      </div>
      <div className="admin-panel__body p-2">
        <div className="admin-pages-list">
          {entries.map((entry) => {
            const Icon = icons[entry.slug] ?? LayoutList;
                const live = entry.live || entry.slug === "navbar";
                return (
                  <Link
                    key={entry.slug}
                    href={`/admin/pages/${entry.slug}`}
                    className="admin-pages-entry"
                  >
                    <span className="admin-pages-entry__label">
                      <Icon size={17} />
                      <b>{entry.label}</b>
                    </span>
                    <span
                      className={`admin-pages-badge${live ? " is-live" : ""}`}
                    >
                      {live ? "Live" : "Plan"}
                    </span>
                  </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PagesHubPage() {
  return (
    <>
      <PageHeader
        title="Pages & Sections"
        subtitle="Overview · Configure the public website"
      />
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))" }}>
        <EntryGrid kind="page" entries={mainPages} icons={pageIcons} />
        <EntryGrid kind="section" entries={siteSections} icons={sectionIcons} />
      </div>
    </>
  );
}