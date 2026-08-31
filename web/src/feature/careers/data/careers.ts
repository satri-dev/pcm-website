import type { JobOpening, ApplicationStep, WorkBenefit } from "../types";

export const jobOpenings: JobOpening[] = [
  {
    id: "faculty-mgmt",
    title: "Faculty – Management",
    department: "Management",
    type: "Full-time",
    iconBg: "#eef3ff",
    iconColor: "#21409A",
    iconType: "management",
    description:
      "Teaching positions in BBA and BBA-Finance across subjects such as accounting, finance, marketing and human resources.",
    requirements: "Master's degree required; prior teaching experience preferred.",
    applyEmail: "careers@pcm.edu.np",
    applySubject: "Application: Faculty - Management",
  },
  {
    id: "faculty-bcsit",
    title: "Faculty – BCSIT & Computing",
    department: "Technology",
    type: "Full-time",
    iconBg: "#eaf9ee",
    iconColor: "#3F9E35",
    iconType: "tech",
    description:
      "Teaching positions in programming, database, networking and software engineering for the BCSIT program.",
    requirements: "Strong technical background and industry experience valued.",
    applyEmail: "careers@pcm.edu.np",
    applySubject: "Application: Faculty - BCSIT",
  },
  {
    id: "lab-assistant",
    title: "Lab Assistant – IT",
    department: "Technology",
    type: "Full-time",
    iconBg: "#fff7e8",
    iconColor: "#b98a12",
    iconType: "lab",
    description:
      "Support for our computer labs — setup, maintenance and student assistance during practical sessions.",
    requirements: "Diploma or Bachelor's in IT-related field.",
    applyEmail: "careers@pcm.edu.np",
    applySubject: "Application: Lab Assistant - IT",
  },
  {
    id: "admin-staff",
    title: "Administrative Staff",
    department: "Administration",
    type: "Full-time",
    iconBg: "#fdeff0",
    iconColor: "#c0392b",
    iconType: "admin",
    description:
      "Support roles in admissions, examinations, accounts and office administration.",
    requirements: "Strong communication and organisational skills required.",
    applyEmail: "careers@pcm.edu.np",
    applySubject: "Application: Administrative Staff",
  },
];

export const applicationSteps: ApplicationStep[] = [
  { id: "s1", text: "Send your CV and cover letter to careers@pcm.edu.np" },
  { id: "s2", text: "Shortlisted candidates are invited for an interview" },
  { id: "s3", text: "Faculty roles include a demonstration class" },
  { id: "s4", text: "Offer and onboarding within two weeks of selection" },
];

export const workBenefits: WorkBenefit[] = [
  {
    id: "culture",
    iconBg: "#eef3ff",
    iconColor: "#21409A",
    iconType: "culture",
    title: "Supportive culture",
    description:
      "A collegial environment where teaching quality is celebrated and ideas are welcomed.",
  },
  {
    id: "growth",
    iconBg: "#eaf9ee",
    iconColor: "#3F9E35",
    iconType: "growth",
    title: "Professional growth",
    description:
      "Opportunities for training, workshops and academic development throughout the year.",
  },
  {
    id: "impact",
    iconBg: "#fff7e8",
    iconColor: "#b98a12",
    iconType: "impact",
    title: "Meaningful work",
    description:
      "Help shape the careers of hundreds of students who go on to lead across Nepal and beyond.",
  },
];
