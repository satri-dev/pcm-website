export interface ScholarshipType {
  id: string;
  icon: "trophy" | "graduation" | "heart" | "users";
  title: string;
  description: string;
}

export interface ApplicationStep {
  id: string;
  text: string;
}

export interface ScholarshipFaq {
  id: string;
  question: string;
  answer: string;
}
