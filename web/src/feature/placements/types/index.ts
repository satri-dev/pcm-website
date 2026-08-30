export interface RecruitmentPartner {
  id: string;
  sector: string;       // "Banking & Finance" | "Technology & IT" | "Corporate & Startups"
  iconType: "bank" | "tech" | "corporate";
  iconBg: string;       // e.g. "#eaf9ee"
  iconColor: string;    // e.g. "#3F9E35"
  companies: string;    // comma-listed company names
  description: string;
}

export interface CareerService {
  id: string;
  text: string;
}

export interface PlacementStat {
  id: string;
  value: string;        // e.g. "90%", "50+", "3"
  label: string;
}
