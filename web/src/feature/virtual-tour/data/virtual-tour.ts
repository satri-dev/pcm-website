import type { TourSpot, VisitFeature } from "../types";

export const tourSpots: TourSpot[] = [
  {
    id: "main-building",
    title: "Main Building",
    description: "Classrooms, seminar hall and administrative offices.",
    imageSrc: "/assets/img/hero-1.jpg",
    imageAlt: "PCM main building exterior",
    href: "/gallery",
  },
  {
    id: "it-labs",
    title: "IT Labs",
    description: "Modern computer labs for BCSIT practical sessions.",
    imageSrc: "/assets/img/hero-2.jpg",
    imageAlt: "PCM IT computer lab",
    href: "/about/facility",
  },
  {
    id: "library",
    title: "Library",
    description: "Books, journals and a quiet place to study.",
    imageSrc: "/assets/img/hero-3.jpg",
    imageAlt: "PCM library reading room",
    href: "/about/facility",
  },
  {
    id: "seminar-hall",
    title: "Seminar Hall",
    description: "Guest lectures, events and cultural programmes.",
    imageSrc: "/assets/img/hero-4.jpg",
    imageAlt: "PCM seminar hall with students",
    href: "/about/facility",
  },
  {
    id: "sports",
    title: "Sports Ground",
    description: "Football, volleyball and basketball courts.",
    imageSrc: "/assets/img/about-games.jpg",
    imageAlt: "Students playing sports at PCM",
    href: "/about/facility",
  },
  {
    id: "campus",
    title: "Campus & Surroundings",
    description: "Gyan Marg, Nadipur — views and directions.",
    imageSrc: "/assets/img/about-1.jpg",
    imageAlt: "PCM campus at Nadipur Pokhara",
    href: "/about/campus-map",
  },
];

export const visitFeatures: VisitFeature[] = [
  { id: "v1", text: "Walk-in visits welcome, Sunday – Friday" },
  { id: "v2", text: "Guided campus tours by request" },
  { id: "v3", text: "Meet the faculty and admissions team" },
  { id: "v4", text: "See the classrooms, labs and library" },
];
