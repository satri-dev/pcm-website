"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/core/lib/auth-client";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  AlertCircle,
  BarChart3,
  Calendar,
  GraduationCap,
  Award,
  HelpCircle,
  Users,
  Shield,
  MessageCircle,
  UserCheck,
  Circle,
  Pencil,
  ImageIcon,
  Download,
  Building,
  Map,
  Bot,
  Trash2,
  HardDrive,
  Search,
  ShieldCheck,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badgeKey?: string;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface ContentCounts {
  [key: string]: number;
}

interface SiteSettings {
  collegeName: string;
  logoUrl: string;
}

interface UserInfo {
  name: string;
  email: string;
}

const navigation: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Pages & Sections", href: "/admin/pages", icon: FileText },
    ],
  },
  {
    title: "Content",
    items: [
      {
        label: "News",
        href: "/admin/content/news",
        icon: Newspaper,
        badgeKey: "news",
      },
      {
        label: "Notices",
        href: "/admin/content/notices",
        icon: AlertCircle,
        badgeKey: "notices",
      },
      {
        label: "Results",
        href: "/admin/content/results",
        icon: BarChart3,
        badgeKey: "results",
      },
      {
        label: "Events & Workshops",
        href: "/admin/content/events",
        icon: Calendar,
        badgeKey: "events",
      },
      {
        label: "Programs",
        href: "/admin/content/programs",
        icon: GraduationCap,
        badgeKey: "programs",
      },
      {
        label: "Scholarships",
        href: "/admin/content/scholarships",
        icon: Award,
        badgeKey: "scholarships",
      },
      {
        label: "FAQs",
        href: "/admin/content/faqs",
        icon: HelpCircle,
        badgeKey: "faqs",
      },
      {
        label: "Content Trash",
        href: "/admin/content/trash",
        icon: Trash2,
      },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Faculty & Staff", href: "/admin/people/faculty", icon: Users },
      { label: "Board of Directors", href: "/admin/people/bod", icon: Shield },
      { label: "Leadership Messages", href: "/admin/people/leadership-message", icon: MessageCircle },
      { label: "Alumni", href: "/admin/people/alumni", icon: UserCheck },
      { label: "Clubs", href: "/admin/people/clubs", icon: Circle },
    ],
  },
  {
    title: "Media",
    items: [
      {
        label: "Blogs",
        href: "/admin/media/blogs",
        icon: Pencil,
        badgeKey: "blogs",
      },
      {
        label: "Gallery",
        href: "/admin/media/gallery",
        icon: ImageIcon,
        badgeKey: "gallery",
      },
      {
        label: "Downloads",
        href: "/admin/media/downloads",
        icon: Download,
        badgeKey: "downloads",
      },
      {
        label: "Media Trash",
        href: "/admin/media/trash",
        icon: Trash2,
      },
    ],
  },
  {
    title: "Campus",
    items: [
      { label: "Facilities", href: "/admin/campus/facilities", icon: Building },
      { label: "Campus Map", href: "/admin/campus/campus-map", icon: Map },
      { label: "Campus Trash", href: "/admin/campus/trash", icon: Trash2 },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Chatbot KB", href: "/admin/system/chat-bot", icon: Bot },
      { label: "System Trash", href: "/admin/system/trash", icon: Trash2 },
      { label: "Backups", href: "/admin/system/backups", icon: HardDrive },
      { label: "SEO & Meta", href: "/admin/system/seo", icon: Search },
      { label: "Users & Roles", href: "/admin/system/users", icon: ShieldCheck },
      { label: "Settings", href: "/admin/system/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const current = pathname || "/admin";
  const [counts, setCounts] = useState<ContentCounts | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    collegeName: "PCM",
    logoUrl: "/logo-pcm.png",
  });
  const [user, setUser] = useState<UserInfo | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // Fetch content counts
    fetch("/api/admin/content-counts")
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data: ContentCounts | null) => {
        if (data) setCounts(data);
      })
      .catch(() => {});

    // Fetch site settings
    fetch("/api/admin/system/settings")
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data: SiteSettings | null) => {
        if (data) setSiteSettings(data);
      })
      .catch(() => {});

    // Fetch current user session
    authClient.getSession().then(({ data }) => {
      if (data?.user) {
        setUser({
          name: data.user.name,
          email: data.user.email,
        });
      }
    }).catch(() => {});
  }, []);

  function isActive(href: string) {
    if (href === "/admin") return current === "/admin";
    return current.startsWith(href);
  }

  function getBadge(item: NavItem): string | undefined {
    if (item.badgeKey && counts) {
      const val = counts[item.badgeKey as keyof ContentCounts];
      if (val !== undefined && val > 0) return String(val);
    }
    return item.badge;
  }

  return (
    <aside className="admin-sidebar" id="sidebar">
      <Link href="/admin" className="admin-sidebar__brand">
        <Image
          src={siteSettings.logoUrl}
          alt={`${siteSettings.collegeName} Logo`}
          width={40}
          height={40}
          className="admin-sidebar__brand-img"
        />
        <div>
          <b>{siteSettings.collegeName} Admin</b>
          <span>Content Manager</span>
        </div>
      </Link>

      <nav className="admin-sidebar__nav">
        {navigation.map((section, sIdx) => (
          <div key={section.title}>
            {sIdx > 0 && (
              <div className="admin-nav-sec" style={{ marginTop: "0.5rem" }}>
                {section.title}
              </div>
            )}
            {sIdx === 0 && <div className="admin-nav-sec">{section.title}</div>}
            {section.items.map((item) => {
              const Icon = item.icon;
              const badge = getBadge(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link${isActive(item.href) ? " active" : ""}`}
                >
                  <Icon size={17} />
                  {item.label}
                  {badge && <span className="admin-nav-badge">{badge}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar__foot">
        <div className="admin-sidebar__user">
          <div className="admin-sidebar__avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="admin-sidebar__user-info">
            <b>{user?.name || "Loading..."}</b>
            <span>{user?.email || ""}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={async () => {
            await authClient.signOut();
            router.push("/login");
            router.refresh();
          }}
          className="admin-icon-btn"
          aria-label="Sign out"
          title="Sign out"
          style={{ marginLeft: "auto", flexShrink: 0 }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
