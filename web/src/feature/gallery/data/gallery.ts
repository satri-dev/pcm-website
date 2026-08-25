import type { GalleryAlbum, GalleryPhoto, GalleryVideo } from "../types";

const IMG = "/assets/img";

// ── Albums ──────────────────────────────────────────────────
export const albums: GalleryAlbum[] = [
  {
    id: "fest",
    title: "PCM FEST 2083",
    category: "cultural",
    date: "Jul 05, 2026",
    coverSrc: `${IMG}/hero-4.jpg`,
    coverAlt: "PCM Fest 2083 — students celebrating on stage",
    photoCount: 4,
  },
  {
    id: "press-meet",
    title: "Demo Press Meet",
    category: "academic",
    date: "Jul 10, 2026",
    coverSrc: `${IMG}/hero-6.jpg`,
    coverAlt: "Students at the model press meet event",
    photoCount: 2,
  },
  {
    id: "workshop",
    title: "Data Analytics Workshop",
    category: "academic",
    date: "Jun 26, 2026",
    coverSrc: `${IMG}/hero-3.jpg`,
    coverAlt: "Workshop session with students on data analytics",
    photoCount: 2,
  },
  {
    id: "tour",
    title: "Annapurna Educational Tour",
    category: "tour",
    date: "Jun 19, 2026",
    coverSrc: `${IMG}/about-2.jpg`,
    coverAlt: "Students on the Annapurna educational tour",
    photoCount: 3,
  },
  {
    id: "sports",
    title: "Inter-Batch Tournament",
    category: "sports",
    date: "Jun 14, 2026",
    coverSrc: `${IMG}/about-games.jpg`,
    coverAlt: "Inter-batch sports tournament at PCM",
    photoCount: 2,
  },
  {
    id: "campus",
    title: "Campus Life",
    category: "albums",
    date: "2026",
    coverSrc: `${IMG}/about-1.jpg`,
    coverAlt: "Life on the PCM Nadipur campus",
    photoCount: 3,
  },
];

// ── Photos ───────────────────────────────────────────────────
export const photos: GalleryPhoto[] = [
  // fest
  {
    id: "p1",
    albumKey: "fest",
    category: "cultural",
    tag: "Annual Fest",
    title: "Annual Fest 2083",
    description:
      "The whole college comes alive with music, dance and inter-batch contests during our flagship annual celebration.",
    date: "Jul 2026",
    src: `${IMG}/hero-4.jpg`,
    alt: "Annual Fest 2083 stage performance",
  },
  {
    id: "p2",
    albumKey: "fest",
    category: "cultural",
    tag: "Annual Fest",
    title: "Fest Night Concert",
    description:
      "Live bands and student performances close out the annual fest with an unforgettable night.",
    date: "Jul 2026",
    src: `${IMG}/hero-3.jpg`,
    alt: "Fest night concert with student performers",
  },
  {
    id: "p3",
    albumKey: "fest",
    category: "cultural",
    tag: "Cultural",
    title: "Cultural Program",
    description: "Nepal's rich diversity on display through dance, music and dress.",
    date: "2026",
    src: `${IMG}/hero-4.jpg`,
    alt: "Cultural program with traditional costumes",
  },
  {
    id: "p4",
    albumKey: "fest",
    category: "cultural",
    tag: "Convocation",
    title: "Graduation Day",
    description: "Celebrating another cohort ready to go forth and serve.",
    date: "2026",
    src: `${IMG}/about-graduation.jpg`,
    alt: "Graduation day ceremony at PCM",
  },
  // press-meet
  {
    id: "p5",
    albumKey: "press-meet",
    category: "academic",
    tag: "Seminar",
    title: "Guest Lecture Series",
    description:
      "Industry leaders regularly visit PCM to share real-world insight with our students.",
    date: "2026",
    src: `${IMG}/hero-6.jpg`,
    alt: "Guest speaker presenting at PCM seminar",
  },
  {
    id: "p6",
    albumKey: "press-meet",
    category: "academic",
    tag: "Presentation",
    title: "Project Showcase",
    description: "Students present capstone projects to faculty and peers.",
    date: "2026",
    src: `${IMG}/hero-6.jpg`,
    alt: "Students presenting final projects",
  },
  // workshop
  {
    id: "p7",
    albumKey: "workshop",
    category: "academic",
    tag: "Workshop",
    title: "Data Analytics Workshop",
    description: "Hands-on sessions on the tools shaping tomorrow's workplace.",
    date: "2026",
    src: `${IMG}/hero-3.jpg`,
    alt: "Hands-on data analytics workshop session",
  },
  {
    id: "p8",
    albumKey: "workshop",
    category: "academic",
    tag: "Workshop",
    title: "Startup Bootcamp",
    description:
      "Mentors help student teams pitch and prototype their first ventures.",
    date: "2026",
    src: `${IMG}/hero-2.jpg`,
    alt: "Students pitching startup ideas at bootcamp",
  },
  // tour
  {
    id: "p9",
    albumKey: "tour",
    category: "tour",
    tag: "Educational Tour",
    title: "Annapurna Field Trip",
    description:
      "Learning goes beyond the classroom on our educational tours across Pokhara and the hills.",
    date: "2026",
    src: `${IMG}/about-2.jpg`,
    alt: "Students on Annapurna field trip",
  },
  {
    id: "p10",
    albumKey: "tour",
    category: "tour",
    tag: "City Tour",
    title: "Lakeside Study Walk",
    description:
      "Exploring Pokhara's business ecosystem, from Lakeside to local enterprises.",
    date: "2026",
    src: `${IMG}/hero-5.jpg`,
    alt: "Students on Lakeside study walk in Pokhara",
  },
  {
    id: "p11",
    albumKey: "tour",
    category: "tour",
    tag: "Industrial Visit",
    title: "IT Company Visit",
    description:
      "BCSIT cohorts tour tech companies to see how classrooms become careers.",
    date: "2026",
    src: `${IMG}/hero-6.jpg`,
    alt: "BCSIT students visiting an IT company",
  },
  // sports
  {
    id: "p12",
    albumKey: "sports",
    category: "sports",
    tag: "Sports",
    title: "Inter-Batch Tournament",
    description:
      "Football, futsal and cricket keep the PCM spirit competitive and healthy.",
    date: "2026",
    src: `${IMG}/about-games.jpg`,
    alt: "Inter-batch sports tournament match",
  },
  {
    id: "p13",
    albumKey: "sports",
    category: "sports",
    tag: "Sports Day",
    title: "Athletics Meet",
    description: "A full day of track events, tug-of-war and team spirit.",
    date: "2026",
    src: `${IMG}/about-games.jpg`,
    alt: "Students competing in athletics meet",
  },
  // campus
  {
    id: "p14",
    albumKey: "campus",
    category: "albums",
    tag: "Campus",
    title: "Our Nadipur Campus",
    description:
      "A calm, green campus in Gyan Marg, Nadipur — purpose-built for focused learning and community.",
    date: "2026",
    src: `${IMG}/about-1.jpg`,
    alt: "Aerial view of PCM Nadipur campus",
  },
  {
    id: "p15",
    albumKey: "campus",
    category: "albums",
    tag: "Library",
    title: "Learning Resource Centre",
    description: "A quiet, well-stocked space for study, research and reflection.",
    date: "2026",
    src: `${IMG}/about-1.jpg`,
    alt: "Students studying in the PCM library",
  },
  {
    id: "p16",
    albumKey: "campus",
    category: "albums",
    tag: "Classroom",
    title: "Smart Classrooms",
    description:
      "Modern, tech-enabled classrooms built around discussion and collaboration.",
    date: "2026",
    src: `${IMG}/about-2.jpg`,
    alt: "Smart classroom at PCM with projector and students",
  },
];

// ── Videos ───────────────────────────────────────────────────
export const videos: GalleryVideo[] = [];
// Will be populated from admin panel when backend is ready.
// Shape example:
// {
//   id: "v1",
//   title: "Annual Fest 2083 Highlights",
//   category: "cultural",
//   date: "Jul 2026",
//   thumbnailSrc: `${IMG}/hero-4.jpg`,
//   thumbnailAlt: "Fest highlights video thumbnail",
//   youtubeId: "dQw4w9WgXcQ",
//   description: "A full recap of PCM's flagship annual celebration.",
// }

export const CATEGORY_LABELS: Record<string, string> = {
  all:      "All",
  albums:   "Albums",
  sports:   "Sports",
  cultural: "Cultural",
  academic: "Academic",
  tour:     "Tour",
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as Array<
  keyof typeof CATEGORY_LABELS
>;
