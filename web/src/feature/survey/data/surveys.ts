import type { Survey } from "../types";

/**
 * Demo survey data.
 * When the backend is ready, replace this with a fetch to /api/surveys.
 */
export const surveys: Survey[] = [
  {
    id: "student-satisfaction-2083",
    title: "Student Satisfaction Survey 2083",
    description:
      "Help us improve your learning experience by sharing your thoughts on teaching quality, campus facilities and student support.",
    category: "Academic",
    icon: "🎓",
    isActive: true,
    deadline: "2026-09-30",
    estimatedMinutes: 5,
    questions: [
      {
        id: "q1",
        type: "rating",
        label: "How satisfied are you with the overall quality of teaching at PCM?",
        required: true,
        maxRating: 5,
      },
      {
        id: "q2",
        type: "radio",
        label: "Which program are you enrolled in?",
        required: true,
        options: ["BBA", "BBA-Finance", "BCSIT"],
      },
      {
        id: "q3",
        type: "radio",
        label: "How would you rate the availability of faculty outside class hours?",
        required: true,
        options: ["Excellent", "Good", "Average", "Poor"],
      },
      {
        id: "q4",
        type: "checkbox",
        label: "Which areas do you feel need the most improvement? (select all that apply)",
        options: [
          "Teaching methods",
          "Course materials",
          "Campus facilities",
          "Student support services",
          "Extracurricular activities",
        ],
      },
      {
        id: "q5",
        type: "textarea",
        label: "Any additional suggestions or comments?",
        hint: "Your honest feedback helps us improve.",
      },
    ],
  },
  {
    id: "campus-facilities-2083",
    title: "Campus Facilities Feedback",
    description:
      "Share your experience with our library, IT labs, sports ground and other campus facilities.",
    category: "Facilities",
    icon: "🏛️",
    isActive: true,
    deadline: "2026-10-15",
    estimatedMinutes: 3,
    questions: [
      {
        id: "f1",
        type: "rating",
        label: "How would you rate the IT lab facilities?",
        required: true,
        maxRating: 5,
      },
      {
        id: "f2",
        type: "rating",
        label: "How would you rate the library and study spaces?",
        required: true,
        maxRating: 5,
      },
      {
        id: "f3",
        type: "radio",
        label: "How often do you use the sports facilities?",
        options: ["Daily", "Weekly", "Occasionally", "Never"],
      },
      {
        id: "f4",
        type: "select",
        label: "Which facility would you most like to see improved?",
        options: [
          "IT Labs",
          "Library",
          "Classrooms",
          "Canteen",
          "Sports Ground",
          "Restrooms",
        ],
      },
      {
        id: "f5",
        type: "textarea",
        label: "Additional comments on facilities",
        hint: "Any specific issues or suggestions?",
      },
    ],
  },
  {
    id: "placement-readiness-2083",
    title: "Career Readiness & Placement Survey",
    description:
      "Help our placement cell understand student needs and improve career preparation support.",
    category: "Careers",
    icon: "💼",
    isActive: true,
    estimatedMinutes: 4,
    questions: [
      {
        id: "p1",
        type: "radio",
        label: "How prepared do you feel for the job market?",
        required: true,
        options: [
          "Very prepared",
          "Somewhat prepared",
          "Neutral",
          "Somewhat unprepared",
          "Not prepared",
        ],
      },
      {
        id: "p2",
        type: "checkbox",
        label: "Which career support services have you used?",
        options: [
          "CV/cover letter workshops",
          "Mock interviews",
          "Internship placement",
          "Campus recruitment drives",
          "Alumni mentorship",
          "None yet",
        ],
      },
      {
        id: "p3",
        type: "rating",
        label: "How would you rate the placement cell's support so far?",
        maxRating: 5,
      },
      {
        id: "p4",
        type: "text",
        label: "What industry are you targeting after graduation?",
        hint: "e.g. Banking, IT, NGO, Startup",
      },
      {
        id: "p5",
        type: "textarea",
        label: "What additional support would help you most?",
      },
    ],
  },
];
