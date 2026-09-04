"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/core/lib/auth-client";
import {
  LayoutDashboard,
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
  ChevronDown,
  Home,
  Info,
  DoorOpen,
  Sparkles,
  Mail,
  CalendarDays,
  Calculator,
  Heart,
  TrendingUp,
  Ticket,
  PanelTop,
  PanelBottom,
  LayoutList,
  Layers,
  Quote,
  Megaphone,
  BadgeCheck,
  AlignJustify,
  MessageSquare,
  type LucideIcon,
  DownloadIcon,
  UserCheck2,
  DollarSign,
  FileQuestionMark,
  FileQuestionMarkIcon,
  ClipboardList,
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

interface PagesSectionNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  ready?: boolean;
  collapsible?: boolean;
  subItems?: { label: string; href: string }[];
}

const pagesNav: PagesSectionNavItem[] = [
  { label: "Home", href: "/admin/pages/home", icon: Home, ready: true },
  {
    label: "About",
    href: "/admin/pages/about",
    icon: Info,
    collapsible: true,
    ready: true,
    subItems: [
      { label: "Overview", href: "/admin/pages/about" },
      { label: "Board of Directors", href: "/admin/pages/about/board" },
      { label: "Message from the Chair", href: "/admin/pages/about/message" },
      { label: "Faculty & Staff", href: "/admin/pages/about/faculty" },
      { label: "Campus & Facilities", href: "/admin/pages/about/facility" },
      { label: "Campus Map", href: "/admin/pages/about/campus-map" },
    ],
  },
  {
    label: "Admission",
    href: "/admin/pages/admission",
    icon: DoorOpen,
    ready: true,
  },
  {
    label: "Programs",
    href: "/admin/pages/programs",
    icon: Layers,
    collapsible: true,
    ready: true,
    subItems: [], // Will be populated dynamically
  },
  {
    label: "News",
    href: "/admin/pages/news",
    icon: Newspaper,
    collapsible: true,
    ready: true,
    subItems: [{ label: "News Article", href: "/admin/pages/news-article" }],
  },
  {
    label: "Notices",
    href: "/admin/pages/notices",
    icon: AlertCircle,
    ready: true,
  },
  {
    label: "Results",
    href: "/admin/pages/results",
    icon: BarChart3,
    ready: true,
  },
  {
    label: "Events",
    href: "/admin/pages/events",
    icon: CalendarDays,
    ready: true,
  },
  {
    label: "Gallery",
    href: "/admin/pages/gallery",
    icon: ImageIcon,
    ready: true,
  },
  {
    label: "Downloads",
    href: "/admin/pages/downloads",
    icon: DownloadIcon,
    ready: true,
  },
  {
    label: "Blogs",
    href: "/admin/pages/blogs",
    icon: Pencil,
    collapsible: true,
    ready: true,
    subItems: [
      { label: "Blogs", href: "/admin/pages/blogs" },
      { label: "Student Blogs", href: "/admin/pages/blog-student" },
    ],
  },
  { label: "Clubs", href: "/admin/pages/clubs", icon: Sparkles, ready: true },
  { label: "Feedback", href: "/admin/pages/feedback", icon: MessageSquare, ready: true },
  {
    label: "Alumni",
    href: "/admin/pages/alumni",
    icon: GraduationCap,
    ready: true,
  },
  { label: "Life at PCM", href: "/admin/pages/life", icon: Heart, ready: true },
  {
    label: "Testimonials",
    href: "/admin/pages/testimonials",
    icon: Quote,
    ready: true,
  },
  {
    label: "GPA Converter",
    href: "/admin/pages/gpa-converter",
    icon: Calculator,
    ready: true,
  },
  { label: "Contact", href: "/admin/pages/contact", icon: Mail, ready: true },
  {
    label: "Placements",
    href: "/admin/pages/placements",
    icon: UserCheck2,
    ready: true,
  },
  {
    label: "Career",
    href: "/admin/pages/career",
    icon: Users,
    ready: true,
  },
  {
    label: "Scholarship",
    href: "/admin/pages/scholarship",
    icon: DollarSign,
    ready: true,
  },
  {
    label: "FAQ",
    href: "/admin/pages/faq",
    icon: HelpCircle,
    ready: true,
  },
  {
    label: "Alumni",
    href: "/admin/pages/alumni",
    icon: UserCheck,
    ready: true,
  },

];

const sectionsNav: PagesSectionNavItem[] = [
  { label: "Navbar", href: "/admin/pages/navbar", icon: PanelTop, ready: true },
  {
    label: "Topbar",
    href: "/admin/pages/topbar",
    icon: AlignJustify,
    ready: true,
  },
  {
    label: "Footer",
    href: "/admin/pages/footer",
    icon: PanelBottom,
    ready: true,
  },
  {
    label: "CTA Banners",
    href: "/admin/pages/cta",
    icon: Megaphone,
    ready: true,
  },
  {
    label: "Apply Now Buttons",
    href: "/admin/pages/apply-now",
    icon: BadgeCheck,
    ready: true,
  },
  {
    label: "Tickers",
    href: "/admin/pages/tickers",
    icon: TrendingUp,
    ready: true,
  },
  {
    label: "Chat Widget",
    href: "/admin/pages/chat-widget",
    icon: MessageCircle,
    ready: true,
  },
  {
    label: "Admission Modal",
    href: "/admin/pages/admission-modal",
    icon: Ticket,
    ready: true,
  },
];

const navigation: NavSection[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
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
        label: "Applications",
        href: "/admin/content/applications",
        icon: FileQuestionMark,
        badgeKey: "applications",
      },
      {
        label: "Feedback",
        href: "/admin/content/feedback",
        icon: MessageSquare,
        badgeKey: "feedback",
      },
      {
        label: "Surveys",
        href: "/admin/content/surveys",
        icon: FileQuestionMarkIcon,
        badgeKey: "surveys",
      },
      {
        label: "Survey Responses",
        href: "/admin/content/survey-responses",
        icon: ClipboardList,
        badgeKey: "surveyResponses",
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
      {
        label: "Leadership Messages",
        href: "/admin/people/leadership-message",
        icon: MessageCircle,
      },
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
      {
        label: "Users & Roles",
        href: "/admin/system/users",
        icon: ShieldCheck,
      },
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
  const [pagesOpen, setPagesOpen] = useState<boolean>(
    () => pathname === "/admin/pages" || pathname.startsWith("/admin/pages/"),
  );
  const [programsOpen, setProgramsOpen] = useState<boolean>(() =>
    pathname.startsWith("/admin/pages/programs/"),
  );
  const [aboutOpen, setAboutOpen] = useState<boolean>(() =>
    pathname.startsWith("/admin/pages/about/"),
  );
  const [blogsOpen, setBlogsOpen] = useState<boolean>(() =>
    pathname.startsWith("/admin/pages/blog"),
  );
  const [programs, setPrograms] = useState<
    { slug: string; name: string; code: string }[]
  >([]);

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
    authClient
      .getSession()
      .then(({ data }) => {
        if (data?.user) {
          setUser({
            name: data.user.name,
            email: data.user.email,
          });
        }
      })
      .catch(() => {});

    // Fetch programs for sidebar navigation
    fetch("/api/admin/content/programs?pageSize=50")
      .then(async (res) => {
        console.log("[AdminSidebar] Programs API response status:", res.status);
        if (!res.ok) {
          const text = await res.text();
          console.error(
            "[AdminSidebar] Programs API failed:",
            res.status,
            text,
          );
          return null;
        }
        return res.json();
      })
      .then(
        (
          data: {
            items: { slug: string; name: string; code: string }[];
          } | null,
        ) => {
          console.log("[AdminSidebar] Programs loaded:", data);
          if (data?.items) {
            console.log(
              "[AdminSidebar] Setting programs state with",
              data.items.length,
              "items",
            );
            setPrograms(data.items);
          }
        },
      )
      .catch((err) => {
        console.error("[AdminSidebar] Failed to load programs:", err);
      });
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

  const isPagesArea =
    current === "/admin/pages" || current.startsWith("/admin/pages/");

  function renderSubLink(item: PagesSectionNavItem, active: boolean) {
    const Icon = item.icon;

    // Handle collapsible items (Programs is dynamic; About/Blogs use static sub-items)
    if (item.collapsible) {
      const isPrograms = item.label === "Programs";
      const isOpen = isPrograms
        ? programsOpen
        : item.label === "About"
          ? aboutOpen
          : blogsOpen;
      const setOpen = isPrograms
        ? setProgramsOpen
        : item.label === "About"
          ? setAboutOpen
          : setBlogsOpen;

      const subLinks = isPrograms
        ? programs.map((prog) => ({
            label: prog.code || prog.name,
            href: `/admin/pages/programs/${prog.slug}`,
          }))
        : (item.subItems ?? []);

      const hasSubActive = subLinks.some(
        (s) => current === s.href || current.startsWith(s.href + "/"),
      );

      return (
        <div key={item.href}>
          <div className="flex items-stretch">
            <Link
              href={item.href}
              className={`admin-nav-link admin-nav-link--sub${active || hasSubActive ? " active" : ""}${item.ready ? " is-ready" : ""}`}
              style={{ flex: 1, paddingRight: "0.3rem", borderRight: "none" }}
            >
              <Icon size={16} />
              {item.label}
              {item.ready && <span className="ready-dot" title="Ready" />}
            </Link>
            <button
              type="button"
              className={`admin-nav-link admin-nav-link--sub${active || hasSubActive ? " active" : ""}`}
              style={{
                flex: "0 0 auto",
                paddingLeft: "0.3rem",
                paddingRight: "0.65rem",
                borderLeft: "none",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!isOpen);
              }}
            >
              <ChevronDown
                className="admin-nav-group__chevron"
                size={14}
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
          </div>

          {isOpen && (
            <div>
              {subLinks.length > 0 ? (
                subLinks.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={`admin-nav-link admin-nav-link--nested${current === sub.href ? " active" : ""}`}
                  >
                    {sub.label}
                  </Link>
                ))
              ) : (
                <div
                  className="admin-nav-link admin-nav-link--nested"
                  style={{ opacity: 0.5, cursor: "default" }}
                >
                  Loading... (0 found)
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Regular non-collapsible links
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`admin-nav-link admin-nav-link--sub${active ? " active" : ""}${item.ready ? " is-ready" : ""}`}
      >
        <Icon size={16} />
        {item.label}
        {item.ready && <span className="ready-dot" title="Ready" />}
      </Link>
    );
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

            {sIdx === 0 && (
              <div style={{ marginTop: "0.15rem" }}>
                <button
                  type="button"
                  className={`admin-nav-group${isPagesArea ? " active" : ""}`}
                  aria-expanded={pagesOpen}
                  aria-controls="pages-sections-panel"
                  onClick={() => setPagesOpen((o) => !o)}
                >
                  <LayoutList size={17} />
                  Pages &amp; Sections
                  <ChevronDown className="admin-nav-group__chevron" size={16} />
                </button>

                {pagesOpen && (
                  <div
                    id="pages-sections-panel"
                    className="pages-sections-panel"
                  >
                    <div className="admin-nav-sec admin-nav-sec--sub">
                      Pages
                    </div>
                    {pagesNav.map((item) =>
                      renderSubLink(item, current.startsWith(item.href)),
                    )}
                    <div className="admin-nav-sec admin-nav-sec--sub">
                      Sections
                    </div>
                    {sectionsNav.map((item) =>
                      renderSubLink(item, current.startsWith(item.href)),
                    )}
                  </div>
                )}
              </div>
            )}
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
