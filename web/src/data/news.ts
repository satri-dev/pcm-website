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
  {
    slug: "prabhat-grant",
    title: "BBA student Prabhat awarded Rs. 12 lakh entrepreneurship grant",
    excerpt:
      "BBA student Prabhat has secured a Rs. 12 lakh entrepreneurship grant to bring his startup idea to life - a proud milestone for PCM's culture of enterprise and innovation.",
    image: "/images/hero-2.jpg",
    date: "24 Jul 2026",
    tag: "Achievement",
    body: [
      "BBA student Prabhat has secured a Rs. 12 lakh entrepreneurship grant to bring his startup idea to life - a proud milestone for PCM's culture of enterprise and innovation.",
    ],
  },
  {
    slug: "annual-fest-2026",
    title: "Annual Fest 2026 lights up the PCM campus",
    excerpt:
      "Music, dance, food stalls and friendly competition brought the whole college together for Annual Fest 2026 - one of the most anticipated events on the PCM calendar.",
    image: "/images/hero-4.jpg",
    date: "17 Jul 2026",
    tag: "Campus Life",
    body: [
      "Music, dance, food stalls and friendly competition brought the whole college together for Annual Fest 2026 - one of the most anticipated events on the PCM calendar.",
    ],
  },
  {
    slug: "annual-fest-nepali",
    title: "PCM Annual Fest celebration",
    excerpt:
      "The much-loved annual festival returned to PCM with vibrant performances, inter-batch contests and a celebration of student creativity and community.",
    image: "/images/hero-3.jpg",
    date: "17 Jul 2026",
    tag: "Event",
    body: [
      "The much-loved annual festival returned to PCM with vibrant performances, inter-batch contests and a celebration of student creativity and community.",
    ],
  },
  {
    slug: "mock-press",
    title: "Model press conference sharpens student communication skills",
    excerpt:
      "Students staged a model press conference, stepping into the roles of journalists and spokespersons to build confidence, critical thinking and public-speaking skills.",
    image: "/images/hero-6.jpg",
    date: "17 Jul 2026",
    tag: "Academics",
    body: [
      "Students staged a model press conference, stepping into the roles of journalists and spokespersons to build confidence, critical thinking and public-speaking skills.",
    ],
  },
  {
    slug: "industry-visit",
    title: "BCSIT cohort tours leading tech company in Kathmandu",
    excerpt:
      "The BCSIT cohort travelled to a leading technology company for a hands-on industry visit, connecting classroom concepts with real-world software engineering practice.",
    image: "/images/about-2.jpg",
    date: "28 Jun 2026",
    tag: "Field Visit",
    body: [
      "The BCSIT cohort travelled to a leading technology company for a hands-on industry visit, connecting classroom concepts with real-world software engineering practice.",
    ],
  },
  {
    slug: "blood-donation",
    title: "PCM clubs organise blood-donation drive",
    excerpt:
      "In partnership with the local Red Cross, PCM student clubs hosted a blood-donation drive that drew enthusiastic participation from students and staff alike.",
    image: "/images/hero-1.jpg",
    date: "12 Jun 2026",
    tag: "Community",
    body: [
      "In partnership with the local Red Cross, PCM student clubs hosted a blood-donation drive that drew enthusiastic participation from students and staff alike.",
    ],
  },
  {
    slug: "scholarship-winners",
    title: "Scholarship winners announced for the 2083 intake",
    excerpt:
      "Merit and need-based scholarship awards for the 2083 intake have been finalised after a transparent selection process involving faculty and administration.",
    image: "/images/hero-3.jpg",
    date: "02 Aug 2026",
    tag: "Scholarship",
    body: [
      "Merit and need-based scholarship awards for the 2083 intake have been finalised after a transparent selection process involving faculty and administration.",
    ],
  },
  {
    slug: "startup-hackathon",
    title: "PCM hosts inter-college startup hackathon",
    excerpt:
      "Student teams from colleges across Pokhara gathered for a 24-hour hackathon to pitch ideas, build prototypes and compete for seed funding.",
    image: "/images/about-1.jpg",
    date: "30 Jul 2026",
    tag: "Campus Life",
    body: [
      "Student teams from colleges across Pokhara gathered for a 24-hour hackathon to pitch ideas, build prototypes and compete for seed funding.",
    ],
  },
  {
    slug: "alumni-meet",
    title: "Alumni meet brings PCM graduates together",
    excerpt:
      "Graduates from across the past two decades returned to campus to share career stories, reconnect with faculty and advise current students.",
    image: "/images/about-graduation.jpg",
    date: "21 Jul 2026",
    tag: "Alumni",
    body: [
      "Graduates from across the past two decades returned to campus to share career stories, reconnect with faculty and advise current students.",
    ],
  },
  {
    slug: "campus-tree-planting",
    title: "Green PCM: students lead tree-planting drive",
    excerpt:
      "The Green PCM initiative saw students and staff plant dozens of native saplings across the campus as part of the college's sustainability pledge.",
    image: "/images/hero-5.jpg",
    date: "14 Jul 2026",
    tag: "Community",
    body: [
      "The Green PCM initiative saw students and staff plant dozens of native saplings across the campus as part of the college's sustainability pledge.",
    ],
  },
  {
    slug: "pu-visit",
    title: "Pokhara University officials visit PCM campus",
    excerpt:
      "Delegates from Pokhara University toured PCM classrooms and labs, reviewing academic facilities ahead of the new intake cycle.",
    image: "/images/hero-2.jpg",
    date: "08 Jul 2026",
    tag: "Academics",
    body: [
      "Delegates from Pokhara University toured PCM classrooms and labs, reviewing academic facilities ahead of the new intake cycle.",
    ],
  },
  {
    slug: "career-day",
    title: "Career day connects students with industry mentors",
    excerpt:
      "Professionals from banking, technology and consulting joined PCM students for panel talks, resume reviews and one-on-one mentoring sessions.",
    image: "/images/about-2.jpg",
    date: "05 Jul 2026",
    tag: "Career",
    body: [
      "Professionals from banking, technology and consulting joined PCM students for panel talks, resume reviews and one-on-one mentoring sessions.",
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
