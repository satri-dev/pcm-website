export type NewsPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  tag: string;
  body: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  tag: string;
  body: string[];
};

export const newsData: NewsPost[] = [
  {
    slug: "admission-open-2026",
    title: "Admissions Open for Academic Year 2026",
    excerpt: "Applications are now open for BBA, BBA-Finance, and BCSIT programs. Don't miss your chance to join PCM's next academic session.",
    image: "/images/hero-2.jpg",
    date: "August 15, 2026",
    tag: "Admissions",
    body: [
      "Pokhara College of Management is excited to announce that admissions for the academic year 2026 are now officially open. We invite ambitious students to apply for our prestigious programs.",
      "We offer three comprehensive degree programs: Bachelor in Business Administration (BBA), Business Administration in Finance (BBA-Finance), and Computer System & Information Technology (BCSIT). Each program is carefully designed to provide students with both theoretical knowledge and practical skills.",
      "The application process is straightforward and can be completed online through our admission portal. All necessary documents and requirements are clearly outlined on our website.",
    ],
  },
  {
    slug: "annual-fest-2025",
    title: "Annual Cultural Festival 2025 - Grand Success",
    excerpt: "PCM's annual cultural festival concluded with spectacular performances and student participation from all programs.",
    image: "/images/hero-4.jpg",
    date: "July 20, 2026",
    tag: "Events",
    body: [
      "The annual cultural festival of Pokhara College of Management concluded with great success, showcasing the diverse talents and creativity of our student community.",
      "Students from all three programs - BBA, BBA-Finance, and BCSIT - participated enthusiastically in various cultural activities, competitions, and performances.",
      "The event featured traditional dance performances, music competitions, drama presentations, and various cultural exhibitions that celebrated the rich heritage of Nepal.",
    ],
  },
  {
    slug: "graduation-ceremony-2025",
    title: "Graduation Ceremony 2025 - New Chapter Begins",
    excerpt: "Celebrating the achievements of our graduates as they embark on their professional journey.",
    image: "/images/about-graduation.jpg",
    date: "June 30, 2026",
    tag: "Academic",
    body: [
      "Pokhara College of Management celebrated another milestone with the graduation ceremony for the class of 2025, marking the successful completion of academic journeys for our students.",
      "The ceremony honored graduates from all three programs who have demonstrated excellence in their studies and are now ready to make their mark in the professional world.",
      "We are proud of our graduates' achievements and confident that they will contribute meaningfully to their chosen fields and society as a whole.",
    ],
  },
];

export const blogsData: BlogPost[] = [
  {
    slug: "career-guidance-tips",
    title: "5 Essential Career Guidance Tips for Students",
    excerpt: "Practical advice for students to navigate their career path effectively and make informed decisions about their future.",
    image: "/images/hero-1.jpg",
    date: "August 10, 2026",
    tag: "Career",
    body: [
      "Choosing the right career path is one of the most important decisions you'll make in your life. Here are five essential tips to guide you through this process.",
      "First, take time to understand your interests, strengths, and values. Self-reflection is crucial in identifying career options that align with your personality and goals.",
      "Second, research different career options thoroughly. Don't limit yourself to obvious choices - explore emerging fields and unconventional paths that might suit your skills.",
    ],
  },
  {
    slug: "finance-fundamentals",
    title: "Understanding Finance Fundamentals",
    excerpt: "A beginner's guide to understanding basic financial concepts that every business student should know.",
    image: "/images/hero-5.jpg",
    date: "August 5, 2026",
    tag: "Finance",
    body: [
      "Finance is the backbone of any business operation. Understanding fundamental financial concepts is essential for making informed business decisions.",
      "Key concepts include cash flow management, financial statements analysis, budgeting, and investment evaluation. These form the foundation of financial literacy.",
      "Whether you're planning to start your own business or work in the corporate world, these financial fundamentals will serve you well throughout your career.",
    ],
  },
  {
    slug: "tech-industry-trends",
    title: "Current Trends in the IT Industry",
    excerpt: "Exploring the latest trends and technologies that are shaping the future of the IT industry.",
    image: "/images/hero-6.jpg",
    date: "July 28, 2026",
    tag: "Technology",
    body: [
      "The IT industry is constantly evolving, with new technologies and trends emerging regularly. Staying updated with these trends is crucial for IT professionals.",
      "Artificial Intelligence and Machine Learning continue to dominate the tech landscape, transforming how businesses operate and deliver services.",
      "Cloud computing, cybersecurity, and mobile development remain strong areas of growth, offering numerous opportunities for skilled professionals.",
    ],
  },
];

export function getNewsBySlug(slug: string) {
  return newsData.find((post) => post.slug === slug);
}

export function getBlogBySlug(slug: string) {
  return blogsData.find((post) => post.slug === slug);
}
