export type Landmark = {
  id: string;
  name: string;
  category: string;
  icon: string;
  x: number;
  y: number;
  desc: string;
};

export const landmarks: Landmark[] = [
  { id: "l1", name: "Main Building", category: "Academic", icon: "🏫", x: 18, y: 40, desc: "Classrooms, faculty rooms and the admissions desk. The heart of the college." },
  { id: "l2", name: "Administrative Office", category: "Academic", icon: "🗂️", x: 11, y: 27, desc: "Exams, records, certificates and general enquiries are handled here." },
  { id: "l3", name: "Learning Resource Centre", category: "Library", icon: "📚", x: 47, y: 25, desc: "Our library with reference texts, journals, e-resources and quiet study areas." },
  { id: "l4", name: "IT & Computer Labs", category: "IT", icon: "💻", x: 77, y: 30, desc: "Modern computers and software for BCSIT practicals and workshops." },
  { id: "l5", name: "Seminar Hall", category: "Academic", icon: "🎤", x: 47, y: 57, desc: "Guest lectures, presentations and college events are hosted here." },
  { id: "l6", name: "Cafeteria", category: "Student Life", icon: "☕", x: 75, y: 62, desc: "Meals, snacks and the daily buzz of campus life between classes." },
  { id: "l7", name: "Sports Ground", category: "Sports", icon: "⚽", x: 13, y: 76, desc: "Football, volleyball and outdoor games for every batch." },
  { id: "l8", name: "Main Gate", category: "General", icon: "🚪", x: 45, y: 79, desc: "The main entrance on Gyan Marg. Visitor passes available at the gate." },
];

export const categoryColors: Record<string, string> = {
  Academic: "#21409A",
  Library: "#E0A400",
  IT: "#0E8A5F",
  Sports: "#16A34A",
  "Student Life": "#D97706",
  General: "#64748B",
};
