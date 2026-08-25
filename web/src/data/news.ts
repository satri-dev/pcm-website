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
  cat: string;
  color: string;
  body: string[];
};

export type StudentBlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  tag: string;
  cat: string;
  color: string;
  author: string;
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
    slug: "careers-after-bba",
    title: "10 career paths after a BBA degree",
    excerpt: "A BBA opens doors across marketing, finance, HR, operations and entrepreneurship. Here is where PCM graduates go.",
    image: "/images/hero-1.jpg",
    date: "02 Aug 2026",
    tag: "Career",
    cat: "career",
    color: "#4167C9",
    body: [
      "A BBA opens doors across marketing, finance, HR, operations and entrepreneurship. Here is where PCM graduates go.",
    ],
  },
  {
    slug: "finance-future-nepal",
    title: "Why financial literacy is the skill of the next decade",
    excerpt: "From personal savings to national markets, financial literacy shapes decisions. A look at how PCM's finance track builds it.",
    image: "/images/hero-5.jpg",
    date: "28 Jul 2026",
    tag: "Finance",
    cat: "finance",
    color: "#51B747",
    body: [
      "From personal savings to national markets, financial literacy shapes decisions. A look at how PCM's finance track builds it.",
    ],
  },
  {
    slug: "bcsit-ai-era",
    title: "What BCSIT students should learn in the AI era",
    excerpt: "Artificial intelligence is changing software careers. The fundamentals that still matter — and the new skills to add.",
    image: "/images/hero-6.jpg",
    date: "20 Jul 2026",
    tag: "Tech",
    cat: "tech",
    color: "#21409A",
    body: [
      "Artificial intelligence is changing software careers. The fundamentals that still matter — and the new skills to add.",
    ],
  },
  {
    slug: "pokhara-startups",
    title: "Inside Pokhara's growing startup scene",
    excerpt: "From coffee brands to fintech, Pokhara's entrepreneurs are building big things. PCM students are joining them early.",
    image: "/images/hero-2.jpg",
    date: "11 Jul 2026",
    tag: "Campus",
    cat: "campus",
    color: "#3F9E35",
    body: [
      "From coffee brands to fintech, Pokhara's entrepreneurs are building big things. PCM students are joining them early.",
    ],
  },
  {
    slug: "scholarship-guide-2083",
    title: "Scholarships at PCM: a complete guide for 2083",
    excerpt: "Merit awards, need-based support and how to apply. Everything families ask us about financing a PCM degree.",
    image: "/images/hero-3.jpg",
    date: "30 Jun 2026",
    tag: "Admission",
    cat: "admission",
    color: "#4167C9",
    body: [
      "Merit awards, need-based support and how to apply. Everything families ask us about financing a PCM degree.",
    ],
  },
  {
    slug: "first-semester-tips",
    title: "Surviving (and enjoying) your first semester at PCM",
    excerpt: "Orientation, clubs, deadlines and cafeterias — a no-nonsense guide to thriving in your first months on campus.",
    image: "/images/hero-4.jpg",
    date: "18 Jun 2026",
    tag: "Student Life",
    cat: "student-life",
    color: "#51B747",
    body: [
      "Orientation, clubs, deadlines and cafeterias — a no-nonsense guide to thriving in your first months on campus.",
    ],
  },
];

export const studentBlogsData: StudentBlogPost[] = [
  {
    slug: "student-blog-internships",
    title: "My summer internship at a Pokhara tech firm",
    excerpt: "Three months of real code, real clients and real deadlines. Here is what I learned beyond the classroom.",
    image: "/images/hero-6.jpg",
    date: "25 Jul 2026",
    tag: "Internships — BCSIT '26",
    cat: "internships",
    color: "#21409A",
    author: "Aarati Gurung",
    body: [
      "Three months of real code, real clients and real deadlines. Here is what I learned beyond the classroom.",
    ],
  },
  {
    slug: "student-blog-fest-prep",
    title: "Behind the scenes of Annual Fest 2026",
    excerpt: "Stages, sound checks and 200 cups of coffee — how our committee pulled off the biggest fest in PCM history.",
    image: "/images/hero-4.jpg",
    date: "19 Jul 2026",
    tag: "Campus Life — BBA '27",
    cat: "campus-life",
    color: "#51B747",
    author: "Sujan Karki",
    body: [
      "Stages, sound checks and 200 cups of coffee — how our committee pulled off the biggest fest in PCM history.",
    ],
  },
  {
    slug: "student-blog-banking",
    title: "A field visit inside Nepal's banking sector",
    excerpt: "From vaults to credit committees — what a day at a commercial bank taught me about my future career.",
    image: "/images/hero-5.jpg",
    date: "08 Jul 2026",
    tag: "Finance — BBA-Finance '26",
    cat: "finance",
    color: "#3F9E35",
    author: "Priya Shrestha",
    body: [
      "From vaults to credit committees — what a day at a commercial bank taught me about my future career.",
    ],
  },
  {
    slug: "student-blog-mock-press",
    title: "How a mock press conference changed my confidence",
    excerpt: "I used to freeze in front of a crowd. Three rehearsals later, I was fielding questions like a pro.",
    image: "/images/hero-2.jpg",
    date: "29 Jun 2026",
    tag: "Skills — BBA '27",
    cat: "skills",
    color: "#4167C9",
    author: "Rabin Thapa",
    body: [
      "I used to freeze in front of a crowd. Three rehearsals later, I was fielding questions like a pro.",
    ],
  },
  {
    slug: "student-blog-clubs",
    title: "Finding my people: joining PCM's student clubs",
    excerpt: "Music, debate, coding and community — the clubs that made my first year at PCM unforgettable.",
    image: "/images/hero-1.jpg",
    date: "15 Jun 2026",
    tag: "Clubs — BCSIT '27",
    cat: "clubs",
    color: "#51B747",
    author: "Maya Tamang",
    body: [
      "Music, debate, coding and community — the clubs that made my first year at PCM unforgettable.",
    ],
  },
];

export function getNewsBySlug(slug: string) {
  return newsData.find((post) => post.slug === slug);
}

export function getBlogBySlug(slug: string) {
  return blogsData.find((post) => post.slug === slug);
}

export function getStudentBlogBySlug(slug: string) {
  return studentBlogsData.find((post) => post.slug === slug);
}
