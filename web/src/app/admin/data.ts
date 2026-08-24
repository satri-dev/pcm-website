export const summaryStats = [
  {
    label: "Total Pages",
    value: 12,
    sub: "Pages & Sections",
    color: "brand" as const,
    icon: "pages",
  },
  {
    label: "News & Notices",
    value: 9,
    sub: "4 news, 5 notices",
    color: "green" as const,
    icon: "posts",
  },
  {
    label: "Gallery Items",
    value: 6,
    sub: "Media gallery",
    color: "gold" as const,
    icon: "gallery",
  },
  {
    label: "Faculty & Staff",
    value: 20,
    sub: "People directory",
    color: "blue" as const,
    icon: "team",
  },
  {
    label: "Programs",
    value: 3,
    sub: "BBA & BCSIT",
    color: "violet" as const,
    icon: "programs",
  },
  {
    label: "Enquiries",
    value: 134,
    sub: "18 pending",
    color: "red" as const,
    icon: "enquiries",
  },
  {
    label: "Media Files",
    value: 512,
    sub: "2.4 GB used",
    color: "teal" as const,
    icon: "media",
  },
];

export const contentByCollection = [
  { label: "News", value: 4, color: "#21409a" },
  { label: "Notices", value: 5, color: "#1e9e56" },
  { label: "Results", value: 8, color: "#d9a514" },
  { label: "Events", value: 5, color: "#2f8fb0" },
  { label: "Programs", value: 3, color: "#7a54d6" },
  { label: "Scholarships", value: 4, color: "#e07a1f" },
  { label: "FAQs", value: 7, color: "#d64545" },
];

export const galleryByCategory = [
  { label: "Campus", count: 64, color: "#21409a" },
  { label: "Events", count: 48, color: "#1e9e56" },
  { label: "Students", count: 42, color: "#d9a514" },
  { label: "Faculty", count: 36, color: "#2f8fb0" },
  { label: "Activities", count: 32, color: "#7a54d6" },
  { label: "Infrastructure", count: 24, color: "#e07a1f" },
  { label: "Graduation", count: 10, color: "#d64545" },
];

export const seoHealth = {
  overall: 78,
  items: [
    { page: "Home", score: 92, status: "good" as const },
    { page: "About", score: 85, status: "good" as const },
    { page: "Programs", score: 74, status: "warning" as const },
    { page: "Admissions", score: 68, status: "warning" as const },
    { page: "Blog", score: 81, status: "good" as const },
    { page: "Contact", score: 55, status: "poor" as const },
    { page: "Gallery", score: 42, status: "poor" as const },
  ],
  meta: {
    withTitle: 10,
    withDescription: 8,
    withOgImage: 6,
    total: 12,
  },
};

export const recentActivity = [
  {
    action: 'Published blog post "Spring Semester 2026 Enrollment"',
    time: "2 hours ago",
    color: "green" as const,
  },
  {
    action: "Updated Gallery — added 12 campus photos",
    time: "5 hours ago",
    color: "blue" as const,
  },
  {
    action: 'Edited page "BBA Program" — updated curriculum section',
    time: "Yesterday",
    color: "brand" as const,
  },
  {
    action: "New enquiry from Ram Shrestha — BCSIT admission",
    time: "Yesterday",
    color: "gold" as const,
  },
  {
    action: 'Deleted draft post "Summer Workshop Schedule"',
    time: "2 days ago",
    color: "red" as const,
  },
  {
    action: "Updated team member — Dr. Sita Adhikari profile",
    time: "3 days ago",
    color: "violet" as const,
  },
];

export const quickActions = [
  { label: "New Post", href: "/admin/blogs/new", icon: "edit", color: "brand" },
  { label: "Add Gallery", href: "/admin/gallery/new", icon: "gallery", color: "gold" },
  { label: "New Page", href: "/admin/pages/new", icon: "pages", color: "green" },
  { label: "Add Team", href: "/admin/team/new", icon: "team", color: "blue" },
  { label: "View Enquiries", href: "/admin/enquiries", icon: "enquiries", color: "red" },
  { label: "SEO Audit", href: "/admin/seo", icon: "seo", color: "violet" },
];
