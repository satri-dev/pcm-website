export type Program = {
  slug: string;
  badge: string;
  title: string;
  image: string;
  heroImage: string;
  summary: string;
  duration: string;
  creditHours: string;
  seats: string;
  overview: string;
  highlights: string[];
};

export const programs: Program[] = [
  {
    slug: "bba",
    badge: "BBA",
    title: "Bachelor in Business Administration",
    image: "/images/program-bba.jpg",
    heroImage: "/images/program-bba.jpg",
    summary:
      "Designed to produce professional managers, giving students sound conceptual foundations alongside the practical skills to lead in a dynamic business world.",
    duration: "4 Years",
    creditHours: "120 Cr",
    seats: "48",
    overview:
      "The BBA program at PCM builds a strong foundation in management, marketing, finance, HR and entrepreneurship through a mix of classroom learning, case studies, field visits and internships.",
    highlights: [
      "Pokhara University affiliated degree",
      "Internship in the final year",
      "Guest lectures from industry leaders",
      "Dedicated placement support",
    ],
  },
  {
    slug: "bba-finance",
    badge: "BBA-Finance",
    title: "Business Administration in Finance",
    image: "/images/program-bbaf.jpg",
    heroImage: "/images/program-bbaf.jpg",
    summary:
      "A finance-focused BBA that builds deep expertise in financial analysis, investment and corporate finance for careers in banking and beyond.",
    duration: "4 Years",
    creditHours: "120 Cr",
    seats: "48",
    overview:
      "This program combines core business administration with a specialised finance track — covering corporate finance, investment analysis, banking and financial markets.",
    highlights: [
      "Specialised finance electives",
      "Bank & fintech internship placements",
      "Bloomberg-style trading lab sessions",
      "CFA/FRM exam preparation guidance",
    ],
  },
  {
    slug: "bcsit",
    badge: "BCSIT",
    title: "Computer System & Information Technology",
    image: "/images/program-bcsit.jpg",
    heroImage: "/images/program-bcsit.jpg",
    summary:
      "A four-year, eight-semester degree merging information technology with business management to meet the evolving demands of modern organisations.",
    duration: "4 Years",
    creditHours: "127 Cr",
    seats: "48",
    overview:
      "BCSIT blends computer science fundamentals — programming, networks, databases, AI — with business and management coursework, preparing graduates for both technical and managerial IT roles.",
    highlights: [
      "Dedicated IT & computer labs",
      "Capstone software project",
      "Industry tours to tech companies",
      "Coding bootcamps & hackathons",
    ],
  },
];

export function getProgramBySlug(slug: string) {
  return programs.find((p) => p.slug === slug);
}
