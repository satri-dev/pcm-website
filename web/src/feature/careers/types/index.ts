export interface JobOpening {
  id: string;
  title: string;
  department: string;
  type: "Full-time" | "Part-time" | "Contract";
  iconBg: string;
  iconColor: string;
  iconType: "management" | "tech" | "lab" | "admin";
  description: string;
  requirements: string;
  applyEmail: string;
  applySubject: string;
}

export interface ApplicationStep {
  id: string;
  text: string;
}

export interface WorkBenefit {
  id: string;
  iconBg: string;
  iconColor: string;
  iconType: "culture" | "growth" | "impact";
  title: string;
  description: string;
}
