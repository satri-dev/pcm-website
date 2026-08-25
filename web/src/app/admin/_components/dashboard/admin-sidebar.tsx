"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
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
      { label: "News", href: "/admin/content/news", icon: Newspaper, badge: "4" },
      { label: "Notices", href: "/admin/content/notices", icon: AlertCircle, badge: "5" },
      { label: "Results", href: "/admin/results", icon: BarChart3, badge: "8" },
      { label: "Events & Workshops", href: "/admin/events", icon: Calendar, badge: "5" },
      { label: "Programs", href: "/admin/programs", icon: GraduationCap, badge: "3" },
      { label: "Scholarships", href: "/admin/scholarships", icon: Award, badge: "4" },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle, badge: "7" },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Faculty & Staff", href: "/admin/team", icon: Users, badge: "20" },
      { label: "Board of Directors", href: "/admin/board", icon: Shield, badge: "7" },
      { label: "Leadership Messages", href: "/admin/leadership", icon: MessageCircle, badge: "5" },
      { label: "Alumni", href: "/admin/alumni", icon: UserCheck, badge: "8" },
      { label: "Clubs", href: "/admin/clubs", icon: Circle, badge: "6" },
    ],
  },
  {
    title: "Media",
    items: [
      { label: "Blogs", href: "/admin/blogs", icon: Pencil, badge: "6" },
      { label: "Gallery", href: "/admin/gallery", icon: ImageIcon, badge: "6" },
      { label: "Downloads", href: "/admin/downloads", icon: Download, badge: "4" },
    ],
  },
  {
    title: "Campus",
    items: [
      { label: "Facilities", href: "/admin/facilities", icon: Building, badge: "6" },
      { label: "Campus Map", href: "/admin/campus-map", icon: Map, badge: "8" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Chatbot KB", href: "/admin/chatbot", icon: Bot, badge: "7" },
      { label: "Trash", href: "/admin/trash", icon: Trash2 },
      { label: "Backups", href: "/admin/backups", icon: HardDrive },
      { label: "SEO & Meta", href: "/admin/seo", icon: Search },
      { label: "Users & Roles", href: "/admin/users", icon: ShieldCheck },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const current = pathname || "/admin";

  function isActive(href: string) {
    if (href === "/admin") return current === "/admin";
    return current.startsWith(href);
  }

  return (
    <aside className="admin-sidebar" id="sidebar">
      <Link href="/admin" className="admin-sidebar__brand">
        <Image
          src="/logo-pcm.png"
          alt="PCM Logo"
          width={40}
          height={40}
          className="admin-sidebar__brand-img"
        />
        <div>
          <b>PCM Admin</b>
          <span>Content Manager</span>
        </div>
      </Link>

      <nav className="admin-sidebar__nav">
        {navigation.map((section, sIdx) => (
          <div key={section.title}>
            {sIdx > 0 && <div className="admin-nav-sec" style={{ marginTop: "0.5rem" }}>{section.title}</div>}
            {sIdx === 0 && <div className="admin-nav-sec">{section.title}</div>}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link${isActive(item.href) ? " active" : ""}`}
                >
                  <Icon size={17} />
                  {item.label}
                  {item.badge && <span className="admin-nav-badge">{item.badge}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar__foot">
        <div className="admin-sidebar__user">
          <div className="admin-sidebar__avatar">A</div>
          <div className="admin-sidebar__user-info">
            <b>Admin User</b>
            <span>admin@pcm.edu.np</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
