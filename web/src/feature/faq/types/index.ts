export interface FaqItem {
  id: string;
  num: string; // "01", "02" etc
  category: string; // "Programs" | "Admissions" | "Eligibility" | "Scholarships" | "GPA" | "Campus" | "Contact"
  question: string;
  answer: string;
}
