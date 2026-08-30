export interface PagesSectionEntry {
  slug: string;
  label: string;
  publicHref: string;
  live?: boolean;
}

// Mirrors the public (main) routes. Each item is a candidate for a real admin
// editor; managers are wired up incrementally.
export const mainPages: PagesSectionEntry[] = [
  { slug: "home", label: "Home", publicHref: "/", live: true },
  { slug: "about", label: "About", publicHref: "/about" },
  { slug: "admission", label: "Admission", publicHref: "/admission" },
  { slug: "alumni", label: "Alumni", publicHref: "/alumni" },
  { slug: "blogs", label: "Blogs", publicHref: "/blogs" },
  { slug: "blog-student", label: "Student Blogs", publicHref: "/blogs-student" },
  { slug: "clubs", label: "Clubs", publicHref: "/clubs" },
  { slug: "contact", label: "Contact", publicHref: "/contact" },
  { slug: "events", label: "Events", publicHref: "/events" },
  { slug: "faq", label: "FAQ", publicHref: "/faq", live: true },
  { slug: "gallery", label: "Gallery", publicHref: "/gallery" },
  { slug: "gpa-converter", label: "GPA Converter", publicHref: "/gpa-converter" },
  { slug: "life", label: "Life at PCM", publicHref: "/life" },
  { slug: "news", label: "News", publicHref: "/news" },
  { slug: "notices", label: "Notices", publicHref: "/notices" },
  { slug: "programs", label: "Programs", publicHref: "/programs" },
  { slug: "results", label: "Results", publicHref: "/results" },
  { slug: "testimonials", label: "Testimonials", publicHref: "/testimonials" },
  { slug: "faq", label: "FAQ", publicHref: "/faq", live:true },
];

// Reusable site chrome/teaser pieces administrators configure.
export const siteSections: PagesSectionEntry[] = [
  { slug: "navbar", label: "Navbar", publicHref: "/" },
  { slug: "topbar", label: "Topbar", publicHref: "/" },
  { slug: "footer", label: "Footer", publicHref: "/" },
  { slug: "cta", label: "CTA Banners", publicHref: "/" },
  { slug: "apply-now", label: "Apply Now Buttons", publicHref: "/admission" },
  { slug: "tickers", label: "Tickers", publicHref: "/" },
  { slug: "chat-widget", label: "Chat Widget", publicHref: "/" },
  { slug: "admission-modal", label: "Admission Modal", publicHref: "/admission" },
];

export function findEntry(
  slug: string
): { entry: PagesSectionEntry; kind: "page" | "section" } | null {
  const page = mainPages.find((p) => p.slug === slug);
  if (page) return { entry: page, kind: "page" };
  const section = siteSections.find((s) => s.slug === slug);
  if (section) return { entry: section, kind: "section" };
  return null;
}