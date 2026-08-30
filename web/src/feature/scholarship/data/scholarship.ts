import type { ScholarshipType, ApplicationStep, ScholarshipFaq } from "../types";

export const scholarshipTypes: ScholarshipType[] = [
  {
    id: "merit",
    icon: "trophy",
    title: "Merit scholarships",
    description:
      "Top performers in the entrance examination and academic results are rewarded with tuition concessions that recognise excellence.",
  },
  {
    id: "pu",
    icon: "graduation",
    title: "Pokhara University awards",
    description:
      "Eligible students may receive PU merit and full scholarships as per university provisions and available quotas.",
  },
  {
    id: "need",
    icon: "heart",
    title: "Need-based support",
    description:
      "Partial concessions for students from economically disadvantaged backgrounds, assessed case by case with sensitivity and fairness.",
  },
  {
    id: "category",
    icon: "users",
    title: "Category &amp; inclusion",
    description:
      "Provisions supporting women, students from remote regions and under-represented communities, in line with university guidelines.",
  },
];

export const applicationSteps: ApplicationStep[] = [
  {
    id: "step-1",
    text: "Indicate your interest in a scholarship on your admission form.",
  },
  {
    id: "step-2",
    text: "Sit the entrance examination — many awards are merit-based on your result.",
  },
  {
    id: "step-3",
    text: "Submit supporting documents for need-based or category awards.",
  },
  {
    id: "step-4",
    text: "Attend a short counselling meeting with the scholarship committee.",
  },
  {
    id: "step-5",
    text: "Receive your decision along with your admission offer.",
  },
];

export const scholarshipFaqs: ScholarshipFaq[] = [
  {
    id: "sfaq-1",
    question: "Can I hold more than one scholarship?",
    answer:
      "Awards are generally not combined, but the committee will always apply the option most beneficial to you.",
  },
  {
    id: "sfaq-2",
    question: "Do I need to reapply every year?",
    answer:
      "Merit continuation depends on maintaining strong semester results. The committee reviews renewals annually.",
  },
  {
    id: "sfaq-3",
    question: "Who can I ask for details?",
    answer:
      "Reach the admissions office at info@pcm.edu.np or (061) 544761 — we're happy to talk you through the options.",
  },
];
