import type { FaqItem } from "../types";

export const FAQ_CATEGORIES = [
  "All",
  "Programs",
  "Admissions",
  "Eligibility",
  "Scholarships",
  "GPA",
  "Campus",
  "Contact",
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export const faqItems: FaqItem[] = [
  {
    id: "faq-1",
    num: "01",
    category: "Programs",
    question: "What programs does PCM offer?",
    answer:
      "PCM offers three four-year bachelor's degrees affiliated to Pokhara University: BBA (Bachelor of Business Administration), BBA-Finance, and BCSIT (Bachelor of Computer Science and Information Technology).",
  },
  {
    id: "faq-2",
    num: "02",
    category: "Admissions",
    question: "What are the eligibility requirements?",
    answer:
      "Applicants must have completed 12 years of schooling (10+2, A-Level, or IB). A minimum CGPA of 1.8 on a 4.0 scale (equivalent to 45%) is required, with at least Grade D in each subject. Candidates must also sit the Pokhara University entrance examination.",
  },
  {
    id: "faq-3",
    num: "03",
    category: "Admissions",
    question: "When do admissions open?",
    answer:
      "Admissions for the 2083 intake are currently open. The entrance examination is scheduled for Ashar 29, 2083 at 8:00 AM. The deadline to submit application forms is Ashar 26, 2083.",
  },
  {
    id: "faq-4",
    num: "04",
    category: "Scholarships",
    question: "Are scholarships available?",
    answer:
      "Yes. PCM offers merit-based scholarships for top-performing students, Pokhara University merit awards, and need-based financial support for students from disadvantaged backgrounds. Visit the Scholarships page for full details.",
  },
  {
    id: "faq-5",
    num: "05",
    category: "GPA",
    question: "How do I calculate my GPA?",
    answer:
      "Use the GPA Converter tool on our website. The formula is: multiply the credit hours for each course by its grade point, sum all the results, then divide by the total number of credit hours. This gives your cumulative GPA.",
  },
  {
    id: "faq-6",
    num: "06",
    category: "Campus",
    question: "What is campus life like?",
    answer:
      "PCM has six active student clubs — eco, finance, coding, debate, music, and sports. Students can participate in the annual college fest, industry visits, skill-building workshops, and internship programmes throughout their studies.",
  },
  {
    id: "faq-7",
    num: "07",
    category: "Contact",
    question: "How do I contact the admissions office?",
    answer:
      "You can reach the admissions office by phone at (061) 544761 or 570124, or by email at info@pcm.edu.np. The office is located at Gyan Marg, Nadipur, Pokhara. Office hours are Sunday to Friday, 6:00 AM – 4:00 PM.",
  },
];
