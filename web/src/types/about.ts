// src/types/about.ts
import type { ObjectId } from "mongodb";

export const ABOUT_COLLECTION = "about";

/* ── Hero ─────────────────────────────────────────────── */

export interface AboutHero {
  h1: string;
  subtitle: string;
}

/* ── Who We Are ───────────────────────────────────────── */

export interface WhoWeAre {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  pills: string[];
  image: string;
  imageAlt: string;
  badge: { value: string; label: string };
}

/* ── Why Study ────────────────────────────────────────── */

export interface WhyStudy {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  cta: { label: string; href: string };
}

/* ── Vision / Mission / Values ────────────────────────── */

export interface VisionCard {
  title: string;
  text: string;
  iconSvg: string;
}

export interface VisionSection {
  eyebrow: string;
  title: string;
  cards: VisionCard[];
}

/* ── PCM Difference ───────────────────────────────────── */

export interface DifferenceItem {
  title: string;
  text: string;
  iconSvg: string;
}

export interface DifferenceSection {
  eyebrow: string;
  title: string;
  items: DifferenceItem[];
}

/* ── Stats ────────────────────────────────────────────── */

export interface AboutStat {
  value: number;
  suffix: string;
  label: string;
}

export interface StatsSection {
  eyebrow: string;
  title: string;
  stats: AboutStat[];
}

/* ── Achievers ────────────────────────────────────────── */

export interface Achiever {
  name: string;
  role: string;
  quote: string;
  photo: string;
}

export interface AchieversSection {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: Achiever[];
}

/* ── CTA ──────────────────────────────────────────────── */

export interface AboutCTA {
  eyebrow: string;
  heading: string;
  description: string;
  primaryButton: { label: string; href: string };
  secondaryButton: { label: string; href: string };
}

/* ── Root ─────────────────────────────────────────────── */

export interface AboutData {
  id: string;
  hero: AboutHero;
  whoWeAre: WhoWeAre;
  whyStudy: WhyStudy;
  vision: VisionSection;
  difference: DifferenceSection;
  stats: StatsSection;
  achievers: AchieversSection;
  cta: AboutCTA;
  updatedAt: string;
}

export interface AboutDocument {
  _id?: ObjectId;
  hero: AboutHero;
  whoWeAre: WhoWeAre;
  whyStudy: WhyStudy;
  vision: VisionSection;
  difference: DifferenceSection;
  stats: StatsSection;
  achievers: AchieversSection;
  cta: AboutCTA;
  createdAt: Date;
  updatedAt: Date;
}

export interface AboutUpdateInput {
  hero?: AboutHero;
  whoWeAre?: WhoWeAre;
  whyStudy?: WhyStudy;
  vision?: VisionSection;
  difference?: DifferenceSection;
  stats?: StatsSection;
  achievers?: AchieversSection;
  cta?: AboutCTA;
}

/* ── Defaults ─────────────────────────────────────────── */

export const DEFAULT_ABOUT_DATA: Omit<AboutDocument, "_id" | "createdAt" | "updatedAt"> = {
  hero: {
    h1: "About Pokhara College of Management",
    subtitle: "Since 2002, a home for confident, creative and adaptive graduates in the heart of Pokhara.",
  },
  whoWeAre: {
    eyebrow: "Who we are",
    title: "Quality management education, made affordable",
    paragraphs: [
      "Pokhara College of Management (PCM), affiliated to Pokhara University, was established in 2002 with an unwavering dedication to developing well-educated, confident, creative and adaptive graduates able to make an impact on an organisation's strategic capability and competitive advantage.",
      "The PCM team firmly believes that quality management education is the need of the hour, as the world transforms into a common business arena. A business leader must understand the global rules to excel in local fields — and that spirit has guided us from humble beginnings to a college trusted by guardians, students and society alike.",
    ],
    pills: ["Pokhara University", "Nadipur, Pokhara", "BBA · BBA-Finance · BCSIT"],
    image: "/assets/img/about-1.jpg",
    imageAlt: "PCM campus and students",
    badge: { value: "23+", label: "Years of Trust" },
  },
  whyStudy: {
    eyebrow: "Why study at PCM?",
    title: "A balanced approach to management",
    paragraphs: [
      "The last two decades of change in information technology have brought unprecedented shifts to the business world. Markets are opening, competition is intensifying, and the horizon of management education is ever-evolving.",
      "Through it all, the time-tested values of management remain a guide. Our programs adopt a well-balanced approach — inculcating a strong theoretical concept of management alongside an intense realisation of its practical application in real life.",
    ],
    image: "/assets/img/about-2.jpg",
    imageAlt: "The PCM campus in Nadipur",
    cta: { label: "See our programs", href: "/programs" },
  },
  vision: {
    eyebrow: "Vision, Mission & Values",
    title: "What we stand for",
    cards: [
      {
        title: "Vision & Mission",
        text: "To identify, develop and unveil the potential of future business leaders who define their own role and boundaries — and grasp the opportunities of a dynamic new world.",
        iconSvg: '<circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />',
      },
      {
        title: "Core Values",
        text: "A value-based organisation promoting discipline, sincerity, hard work and innovation as individual values, and respect, professionalism, fairness, transparency and team spirit as organisational values.",
        iconSvg: '<path d="M6 3h12l4 6-10 12L2 9Z" /><path d="M2 9h20M12 3 8 9l4 12 4-12-4-6" />',
      },
      {
        title: "Objectives",
        text: "To offer highly competitive, professionally oriented education — equipping students with advanced conceptual, analytical and quantitative techniques for decision-making.",
        iconSvg: '<circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" fill="currentColor" />',
      },
    ],
  },
  difference: {
    eyebrow: "The PCM difference",
    title: "What makes us different",
    items: [
      {
        title: "Qualified & experienced faculty",
        text: "A dedicated faculty pool with extensive experience across management and IT, bringing practical, cutting-edge learning into every classroom.",
        iconSvg: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />',
      },
      {
        title: "Guest lectures & workshops",
        text: "Frequent guest lectures from business and IT industry leaders, plus hands-on workshops, are a regular part of the curriculum.",
        iconSvg: '<rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v4" />',
      },
      {
        title: "Specialised, updated IT courses",
        text: "An IT curriculum integrated with management — focused on data analytics, cybersecurity, AI and machine learning.",
        iconSvg: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />',
      },
      {
        title: "Vibrant extracurriculars",
        text: "Student clubs organise sports, entertainment, art and literature, idea pitching and more, all year round.",
        iconSvg: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />',
      },
      {
        title: "Strong industry connections",
        text: "A wide network of industry partners for internships and placement support, opening doors after graduation.",
        iconSvg: '<circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />',
      },
      {
        title: "Individual student care",
        text: "A caring culture that supports every student personally — the difference students notice most about PCM.",
        iconSvg: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" />',
      },
    ],
  },
  stats: {
    eyebrow: "By the numbers",
    title: "A legacy measured in outcomes",
    stats: [
      { value: 80, suffix: "%", label: "Success stories" },
      { value: 100, suffix: "", label: "Dean's List Scholars" },
      { value: 1000, suffix: "", label: "Graduates" },
      { value: 23, suffix: "", label: "Years of Excellence" },
    ],
  },
  achievers: {
    eyebrow: "Voices of PCM",
    title: "What our achievers say",
    subtitle: "Graduates on the Dean's List reflect on their four-year journey — the mentorship, the friendships, and the confidence they carry forward.",
    items: [
      {
        name: "Amrit Adhikari",
        role: "Dean's List · 2075 BS",
        quote: "It gives me profound pleasure to have completed my BBA from PCM. The relationship between faculty and students is very cordial here, and the college gave me the opportunity to excel in my area of interest. The four years I spent here helped me grow professionally and personally.",
        photo: "/assets/img/hero-2.jpg",
      },
      {
        name: "Reena Gurung",
        role: "Dean's List · 2021 AD",
        quote: "The impression I had while first visiting PCM compelled me to be a part of it, and I don't regret that choice. The teaching method, extra-curricular activities, well-equipped facilities and practical knowledge boosted my confidence to face the real world.",
        photo: "/assets/img/about-2.jpg",
      },
      {
        name: "Rima Gurung",
        role: "Dean's List · 2021 AD",
        quote: "I found PCM as my best option — a place to learn, grow and find direction for my career. With an amazing team of faculty and a conducive learning environment, I was able to broaden my outlook and be prepared to face the real world. Enrolling at PCM was the best decision ever.",
        photo: "/assets/img/hero-5.jpg",
      },
      {
        name: "Nischal Shrestha",
        role: "Dean's List · 2021 AD",
        quote: "The freedom to think and act on our own is the best thing about PCM — something you get in very few colleges. PCM emphasises overall development, giving priority to field visits, guest lectures and seminars that broaden horizons and challenge the way we think.",
        photo: "/assets/img/hero-6.jpg",
      },
      {
        name: "Binu Shrestha",
        role: "BBA · Dean's List 2021",
        quote: "I found PCM the best management college in the city and region. Its concern for students at an individual level is simply outstanding. During my PCM days I was inspired to start new ventures with social motives. I salute PCM and will ever remain thankful for its support.",
        photo: "/assets/img/about-graduation.jpg",
      },
      {
        name: "Anusha Sharma",
        role: "BBA · 2016 Batch",
        quote: "Along with theoretical knowledge, PCM focuses on practical learning through field visits and tours. The PCM family is very supportive and always encourages academic excellence through presentations, group learning, seminars, guest lectures and internships.",
        photo: "/assets/img/about-1.jpg",
      },
    ],
  },
  cta: {
    eyebrow: "Enter to Learn — Go Forth to Serve",
    heading: "A step towards your future",
    description: "Applications for the 2083 intake are open across all three programs. Take the first step today.",
    primaryButton: { label: "Apply Now", href: "/admission" },
    secondaryButton: { label: "More Info", href: "/about" },
  },
};
