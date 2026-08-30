import type { RecruitmentPartner, CareerService, PlacementStat } from "../types";

export const recruitmentPartners: RecruitmentPartner[] = [
  {
    id: "banking",
    sector: "Banking & Finance",
    iconType: "bank",
    iconBg: "#eaf9ee",
    iconColor: "#3F9E35",
    companies: "Nabil Bank, NIC Asia, Mega, Global IME, Himalayan and other leading banks",
    description:
      "Nepal's leading banks and financial institutions actively recruit BBA and BBA-Finance graduates for management trainee and analyst roles.",
  },
  {
    id: "tech",
    sector: "Technology & IT",
    iconType: "tech",
    iconBg: "#eef3ff",
    iconColor: "#21409A",
    companies: "F1Soft, Leapfrog, CloudFactory and growing ecosystem of software companies",
    description:
      "Top Nepali tech companies recruit BCSIT graduates for software development, data analysis and IT consulting roles.",
  },
  {
    id: "corporate",
    sector: "Corporate & Startups",
    iconType: "corporate",
    iconBg: "#fff7e8",
    iconColor: "#b98a12",
    companies: "Marketing, HR, operations and management roles across Nepali companies",
    description:
      "Marketing, HR, operations and management roles across Nepali companies, NGOs and new ventures.",
  },
];

export const careerServices: CareerService[] = [
  { id: "cv", text: "CV and cover-letter workshops" },
  { id: "mock", text: "Mock interviews and group-discussion practice" },
  { id: "internship", text: "Internship placement with partner organizations" },
  { id: "campus", text: "Campus recruitment drives and job referrals" },
  { id: "mentorship", text: "Mentorship from alumni working across industries" },
];

export const placementStats: PlacementStat[] = [
  { id: "rate", value: "90%", label: "Placement Rate" },
  { id: "partners", value: "50+", label: "Hiring Partners" },
  { id: "batches", value: "20+", label: "Years of Placements" },
  { id: "sectors", value: "3", label: "Key Sectors" },
];
