export type Facility = {
  id: string;
  name: string;
  category: string;
  icon: string;
  image?: string;
  desc: string;
};

export const facilities: Facility[] = [
  {
    id: "f1",
    name: "Smart Classrooms",
    category: "Learning",
    icon: "🏫",
    image: "/assets/img/about-2.jpg",
    desc: "Spacious, well-lit classrooms with modern projectors, AV systems and comfortable seating.",
  },
  {
    id: "f2",
    name: "Learning Resource Centre",
    category: "Library",
    icon: "📚",
    image: "/assets/img/about-1.jpg",
    desc: "A quiet, fully-stocked library with reference texts, journals, e-resources and study desks.",
  },
  {
    id: "f3",
    name: "IT & Computer Labs",
    category: "IT",
    icon: "💻",
    image: "/assets/img/hero-6.jpg",
    desc: "Dedicated labs with up-to-date computers and software for BCSIT practicals and coding workshops.",
  },
  {
    id: "f4",
    name: "Seminar Hall",
    category: "Learning",
    icon: "🎤",
    image: "/assets/img/hero-3.jpg",
    desc: "A modern hall for guest lectures, presentations, events and student showcases.",
  },
  {
    id: "f5",
    name: "Sports & Recreation",
    category: "Sports",
    icon: "⚽",
    image: "/assets/img/about-games.jpg",
    desc: "Football, volleyball and basketball spaces plus indoor recreation to stay active between classes.",
  },
  {
    id: "f6",
    name: "Cafeteria & Common Room",
    category: "Student Life",
    icon: "☕",
    image: "/assets/img/hero-5.jpg",
    desc: "A clean, friendly place for meals, snacks and hanging out — the heart of daily campus life.",
  },
];

export const facilityCategories = [
  ...new Set(facilities.map((f) => f.category)),
];
