// src/types/homepage.ts
// Canonical schema for the "homepage" collection — stores all configurable
// home page section content that is not already backed by its own collection.

export const HOMEPAGE_COLLECTION = "homepage";
// No maximum limit on hero slides
export const MAX_HERO_SLIDES = Number.MAX_SAFE_INTEGER;

/* ── Hero ─────────────────────────────────────────────── */

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  badge: string;
  heading: string;
  accent: string;
  sub: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: HeroStat[];
}

/* ── Welcome stats ────────────────────────────────────── */

export interface WelcomeStat {
  value: number;
  suffix: string;
  label: string;
}

/* ── Why choose PCM ───────────────────────────────────── */

export interface WhyChooseReason {
  icon: string;
  title: string;
  desc: string;
}

/* ── Testimonials ─────────────────────────────────────── */

export interface HomepageTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  photo: string;
}

/* ── Admission section ────────────────────────────────── */

export interface AdmissionStep {
  number: string;
  title: string;
  description: string;
}

export interface AdmissionDetail {
  label: string;
  value: string;
}

export interface AdmissionConfig {
  badge: string;
  heading: string;
  subheading: string;
  posterImage: string;
  steps: AdmissionStep[];
  details: AdmissionDetail[];
}

/* ── CTA section ──────────────────────────────────────── */

export interface CTAConfig {
  tagline: string;
  heading: string;
  description: string;
  primaryButton: { label: string; href: string };
  secondaryButton: { label: string; href: string };
}

/* ── Root document ────────────────────────────────────── */

export interface HomepageData {
  id: string;
  heroSlides: HeroSlide[];
  welcomeStats: WelcomeStat[];
  whyChooseReasons: WhyChooseReason[];
  testimonials: HomepageTestimonial[];
  admission: AdmissionConfig;
  cta: CTAConfig;
  updatedAt: string;
}

export interface HomepageDocument {
  _id?: import("mongodb").ObjectId;
  heroSlides: HeroSlide[];
  welcomeStats: WelcomeStat[];
  whyChooseReasons: WhyChooseReason[];
  testimonials: HomepageTestimonial[];
  admission: AdmissionConfig;
  cta: CTAConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface HomepageUpdateInput {
  heroSlides?: HeroSlide[];
  welcomeStats?: WelcomeStat[];
  whyChooseReasons?: WhyChooseReason[];
  testimonials?: HomepageTestimonial[];
  admission?: AdmissionConfig;
  cta?: CTAConfig;
}

/* ── Defaults ─────────────────────────────────────────── */

export const DEFAULT_HOMEPAGE_DATA: Omit<HomepageDocument, "_id" | "createdAt" | "updatedAt"> = {
  heroSlides: [
    {
      id: "trust",
      image: "/images/hero-1.jpg",
      badge: "Affiliated to Pokhara University",
      heading: "Quality management & IT education",
      accent: "in the heart of Pokhara",
      sub: "Established in 2002, Pokhara College of Management delivers affordable, quality bachelor's programs that turn four years of study into a career you're proud of.",
      primaryCta: { label: "Apply Now", href: "/admission" },
      secondaryCta: { label: "Explore Programs", href: "/programs" },
      stats: [
        { value: "23+", label: "Years of Trust" },
        { value: "1000+", label: "Graduates" },
        { value: "3", label: "Programs" },
      ],
    },
    {
      id: "apply",
      image: "/images/hero-6.jpg",
      badge: "Affiliated to Pokhara University",
      heading: "Your future starts",
      accent: "with one application",
      sub: "Applications are open for BBA, BBA-Finance and BCSIT. Entrance exam on Ashar 29, 2083 — don't miss your chance to join PCM.",
      primaryCta: { label: "Apply Now", href: "/admission" },
      secondaryCta: { label: "Scholarships", href: "/scholarship" },
      stats: [
        { value: "3", label: "Programs" },
        { value: "120+", label: "Credit Hours" },
        { value: "48", label: "Seats Per Batch" },
      ],
    },
    {
      id: "life",
      image: "/images/hero-4.jpg",
      badge: "Affiliated to Pokhara University",
      heading: "Learn, lead and",
      accent: "make memories",
      sub: "Fests, sports, clubs and community drives — at PCM, education goes far beyond the classroom.",
      primaryCta: { label: "Explore PCM Life", href: "/life" },
      secondaryCta: { label: "View Gallery", href: "/gallery" },
      stats: [
        { value: "10+", label: "Clubs" },
        { value: "30+", label: "Events a Year" },
        { value: "100%", label: "Scholarship Coverage" },
      ],
    },
  ],
  welcomeStats: [
    { value: 80, suffix: "%", label: "Success stories" },
    { value: 100, suffix: "", label: "Dean's List Scholars" },
    { value: 1000, suffix: "", label: "Graduates" },
    { value: 23, suffix: "", label: "Years of Excellence" },
  ],
  whyChooseReasons: [
    { icon: "🎓", title: "PU-affiliated degrees", desc: "All three programs are awarded by Pokhara University — a nationally recognised qualification employers trust." },
    { icon: "💰", title: "Scholarships for all", desc: "Merit and need-based awards with up to 100% coverage, because quality education should stay affordable." },
    { icon: "👩‍🏫", title: "Mentors who know you", desc: "Small batches and an open-door culture mean faculty know your goals — and push you toward them." },
    { icon: "💼", title: "Careers & placements", desc: "Internships, field visits and a dedicated placement team connect classroom learning to real jobs." },
    { icon: "🎉", title: "A campus that comes alive", desc: "Fests, sports, clubs and community drives build confidence and a network that lasts a lifetime." },
    { icon: "📍", title: "Central, safe location", desc: "On Gyan Marg in Nadipur, Pokhara-2 — easy to reach, hard to leave, and close to everything you need." },
  ],
  testimonials: [
    {
      id: "1",
      name: "Amrit Adhikari",
      role: "Dean's List — 2075 BS",
      quote: "It gives me profound pleasure to have completed my BBA from PCM. The relationship between faculty and students is very cordial here, and the college gave me the opportunity to excel in my area of interest. The four years I spent here helped me grow professionally and personally.",
      photo: "/images/hero-2.jpg",
    },
    {
      id: "2",
      name: "Reena Gurung",
      role: "Dean's List — 2021 AD",
      quote: "The impression I had while first visiting PCM compelled me to be a part of it, and I don't regret that choice. The teaching method, extra-curricular activities, well-equipped facilities and practical knowledge boosted my confidence to face the real world.",
      photo: "/images/about-2.jpg",
    },
    {
      id: "3",
      name: "Rima Gurung",
      role: "Dean's List — 2021 AD",
      quote: "I found PCM as my best option — a place to learn, grow and find direction for my career. With an amazing team of faculty and a conducive learning environment, I was able to broaden my outlook and be prepared to face the real world. Enrolling at PCM was the best decision ever.",
      photo: "/images/hero-5.jpg",
    },
    {
      id: "4",
      name: "Nischal Shrestha",
      role: "Dean's List — 2021 AD",
      quote: "The freedom to think and act on our own is the best thing about PCM — something you get in very few colleges. PCM emphasises overall development, giving priority to field visits, guest lectures and seminars that broaden horizons and challenge the way we think.",
      photo: "/images/hero-6.jpg",
    },
  ],
  admission: {
    badge: "Admissions 2083",
    heading: "Join PCM this intake",
    subheading: "A simple, transparent admission process — scholarships available for deserving students.",
    posterImage: "/images/admission-open-2026.png",
    steps: [
      { number: "01", title: "Submit the form", description: "Fill out the online application or pick up a form from the college office before Ashar 26, 2083." },
      { number: "02", title: "Appear for the entrance", description: "The entrance exam is held on Ashar 29, 2083, 8:00 AM at the PCM campus." },
      { number: "03", title: "Secure your seat", description: "Selected candidates complete admission formalities and begin a journey worth starting." },
    ],
    details: [
      { label: "Form deadline", value: "Ashar 26, 2083" },
      { label: "Entrance exam", value: "Ashar 29, 2083 · 8:00 AM" },
      { label: "Programs", value: "BBA · BBA-Finance · BCSIT" },
      { label: "Scholarships", value: "Available" },
    ],
  },
  cta: {
    tagline: "Enter to Learn — Go Forth to Serve",
    heading: "A step towards your future",
    description: "Applications for the 2083 intake are open across all three programs. Take the first step today.",
    primaryButton: { label: "Apply Now", href: "/admission" },
    secondaryButton: { label: "More Info", href: "/about" },
  },
};
