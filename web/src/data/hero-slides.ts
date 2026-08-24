export type HeroStat = { value: string; label: string };

export type HeroSlide = {
  id: string;
  image: string;
  badge: string;
  heading: string;
  accent: string; // the highlighted/green part of the heading
  sub: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: HeroStat[];
};

export const heroSlides: HeroSlide[] = [
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
];
