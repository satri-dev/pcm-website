export type CourseRow = {
  code: string;
  description: string;
  credits: string;
};

export type Semester = {
  label: string;
  courses: CourseRow[];
};

export type Concentration = {
  title: string;
  description: string;
};

export type AdmissionReq = {
  title: string;
  detail: string;
};

export type Program = {
  slug: string;
  badge: string;
  shortName: string;
  fullName: string;
  tagline: string;
  image: string;
  imageAlt: string;
  overviewTitle: string;
  overviewBody: string[];
  concentrations: Concentration[];
  careers: string[];
  admissionRequirements: AdmissionReq[];
  quickFacts: {
    level: string;
    duration: string;
    semesters: number;
    creditHours: number;
    eligibility: string;
    affiliation: string;
  };
  curriculum: Semester[];
  totalCredits: string;
  coordinator: {
    name: string;
    initials: string;
    image: string;
    role: string;
    quote: string;
  };
};

export const programs: Program[] = [
  {
    slug: "bba",
    badge: "BBA",
    shortName: "BBA",
    fullName: "Bachelor in Business Administration",
    tagline:
      "Designed to produce professional managers, giving students sound conceptual foundations alongside the practical skills to lead in a dynamic business world.",
    image: "/assets/img/program-bba.jpg",
    imageAlt: "BBA program at PCM",
    overviewTitle: "Why study BBA at PCM?",
    overviewBody: [
      "The Bachelor of Business Administration (BBA) programme at Pokhara University, which PCM follows, is designed to produce professional managers. It provides students with a sound conceptual foundation and practical skills across the key areas of business.",
      "The BBA is a four-year programme spread over eight semesters. A student completes coursework, project work and an internship — taught entirely in English — to graduate. Beyond the classroom, guest lectures, workshops, field visits and industry projects make learning practical and career-focused.",
    ],
    concentrations: [
      { title: "Marketing", description: "Deepen your knowledge and sharpen your skills in marketing." },
      { title: "Human Resources", description: "Deepen your knowledge and sharpen your skills in human resources." },
      { title: "Management", description: "Deepen your knowledge and sharpen your skills in management." },
      { title: "Entrepreneurship", description: "Deepen your knowledge and sharpen your skills in entrepreneurship." },
    ],
    careers: [
      "Business Manager", "Marketing Executive", "HR Officer", "Entrepreneur",
      "Operations Lead", "Management Trainee", "Business Analyst", "Banker",
    ],
    admissionRequirements: [
      {
        title: "Minimum 12 years of formal schooling",
        detail: "10+2, A-Level, IB or an equivalent recognised by Pokhara University.",
      },
      {
        title: "CGPA 1.8 (on a 4.0 scale) or 45%",
        detail: "A minimum Grade 'D' in individual subjects in any +2 stream, followed by the Pokhara University entrance examination.",
      },
    ],
    quickFacts: {
      level: "Bachelor",
      duration: "4 Years",
      semesters: 8,
      creditHours: 123,
      eligibility: "10+2 / A-Level",
      affiliation: "Pokhara Univ.",
    },
    totalCredits: "123 Credit Hours",
    curriculum: [
      {
        label: "Sem I",
        courses: [
          { code: "ENG 110", description: "English", credits: "3 Cr" },
          { code: "MTH 110", description: "Business Mathematics", credits: "3 Cr" },
          { code: "ICT 110", description: "IT for Business", credits: "3 Cr" },
          { code: "BHS 110", description: "Behavioral Science", credits: "3 Cr" },
          { code: "MGT 111", description: "Principles of Management", credits: "3 Cr" },
          { code: "PRC 110", description: "Software Skills Practicum", credits: "1 Cr" },
        ],
      },
      {
        label: "Sem II",
        courses: [
          { code: "BUC 201", description: "Business Communication", credits: "3 Cr" },
          { code: "MTH 111", description: "Business Mathematics II", credits: "3 Cr" },
          { code: "ECO 110", description: "Introduction to Microeconomics", credits: "3 Cr" },
          { code: "MGT 112", description: "Fundamentals of Organizational Behavior", credits: "3 Cr" },
          { code: "ACC 110", description: "Financial Accounting", credits: "3 Cr" },
          { code: "PRC 111", description: "Soft Skills Practicum", credits: "1 Cr" },
        ],
      },
      {
        label: "Sem III",
        courses: [
          { code: "STT 110", description: "Business Statistics", credits: "3 Cr" },
          { code: "ECO 111", description: "Introduction to Macroeconomics", credits: "3 Cr" },
          { code: "ACC 111", description: "Cost and Management Accounting", credits: "3 Cr" },
          { code: "FIN 110", description: "Essentials of Finance", credits: "3 Cr" },
          { code: "MKT 110", description: "Principles of Marketing", credits: "3 Cr" },
          { code: "PRC 112", description: "Digital Marketing Practicum", credits: "1 Cr" },
        ],
      },
      {
        label: "Sem IV",
        courses: [
          { code: "STT 111", description: "Data Analysis and Modeling", credits: "3 Cr" },
          { code: "MGT 113", description: "Business and Society", credits: "3 Cr" },
          { code: "RCH 110", description: "Business Research Methods", credits: "3 Cr" },
          { code: "MGT 114", description: "Human Resource Management", credits: "3 Cr" },
          { code: "FIN 111", description: "Financial Management", credits: "3 Cr" },
          { code: "PRC 113", description: "Fintech Practicum", credits: "1 Cr" },
        ],
      },
      {
        label: "Sem V",
        courses: [
          { code: "MGT 115", description: "Entrepreneurship and Innovation", credits: "3 Cr" },
          { code: "MGT 116", description: "Fundamentals of Operations Management", credits: "3 Cr" },
          { code: "MIS 110", description: "Management Information System", credits: "3 Cr" },
          { code: "MGT 117", description: "Project Management", credits: "3 Cr" },
          { code: "MIS 111", description: "Essentials of e-Business", credits: "3 Cr" },
          { code: "PRC 114", description: "Academic Writing", credits: "1 Cr" },
        ],
      },
      {
        label: "Sem VI",
        courses: [
          { code: "MGT 118", description: "International Business", credits: "3 Cr" },
          { code: "PRJ 110", description: "Project Work", credits: "3 Cr" },
          { code: "N/A", description: "Elective I", credits: "3 Cr" },
          { code: "N/A", description: "Concentration I", credits: "3 Cr" },
          { code: "PRJ 111", description: "Business Development Project", credits: "2 Cr" },
          { code: "MGT 119", description: "Strategic Management", credits: "3 Cr" },
        ],
      },
      {
        label: "Sem VII",
        courses: [
          { code: "MGT 120", description: "Business Environment", credits: "3 Cr" },
          { code: "LAW 211", description: "Financial Law", credits: "3 Cr" },
          { code: "N/A", description: "Elective II", credits: "3 Cr" },
          { code: "PRJ 112", description: "Community Engagement Project", credits: "2 Cr" },
          { code: "N/A", description: "Concentration II", credits: "3 Cr" },
          { code: "INT 110", description: "Internship", credits: "6 Cr" },
        ],
      },
      {
        label: "Sem VIII",
        courses: [],
      },
    ],
    coordinator: {
      name: "Hari Adhikari",
      initials: "HA",
      image: "/assets/img/people/leader_hariadhikari.jpg",
      role: "BBA Coordinator",
      quote:
        "Every semester I watch BBA students grow from nervous first-years into confident professionals — and that happens because PCM gives them the platform, the mentors and the opportunities to actually lead.",
    },
  },
  {
    slug: "bba-finance",
    badge: "BBA-Finance",
    shortName: "BBA-Finance",
    fullName: "Bachelor in Business Administration — Finance",
    tagline:
      "A finance-focused BBA that builds deep expertise in financial analysis, investment and corporate finance for careers in banking and beyond.",
    image: "/assets/img/program-bbaf.jpg",
    imageAlt: "BBA-Finance program at PCM",
    overviewTitle: "Why study BBA-Finance at PCM?",
    overviewBody: [
      "The Bachelor of Business Administration in Finance (BBA-Finance) at Pokhara University, as offered by PCM, is meticulously designed to nurture skilled financial leaders — integrating rigorous theoretical frameworks with practical applications across every domain of finance.",
      "The BBA-Finance spans four years across eight semesters, taught entirely in English. Graduation requires completion of coursework, project work and an internship, giving you the analytical depth and confidence to manage money, markets and risk.",
    ],
    concentrations: [
      { title: "Corporate Finance", description: "Deepen your knowledge and sharpen your skills in corporate finance." },
      { title: "Investment & Banking", description: "Deepen your knowledge and sharpen your skills in investment and banking." },
      { title: "Financial Analytics", description: "Deepen your knowledge and sharpen your skills in financial analytics." },
      { title: "Risk Management", description: "Deepen your knowledge and sharpen your skills in risk management." },
    ],
    careers: [
      "Investment Analyst", "Risk Analyst", "Estate Planner", "Product Manager",
      "Credit Risk Manager", "Fintech Product Manager", "Banker", "Corporate Leader",
    ],
    admissionRequirements: [
      {
        title: "Minimum 12 years of formal schooling",
        detail: "10+2, A-Level, IB or an equivalent recognised by Pokhara University.",
      },
      {
        title: "CGPA 1.8 (on a 4.0 scale) or 45%",
        detail: "A minimum Grade 'D' in individual subjects in any +2 stream, followed by the Pokhara University entrance examination.",
      },
    ],
    quickFacts: {
      level: "Bachelor",
      duration: "4 Years",
      semesters: 8,
      creditHours: 120,
      eligibility: "10+2 / A-Level",
      affiliation: "Pokhara Univ.",
    },
    totalCredits: "120 Credit Hours",
    curriculum: [
      {
        label: "Sem I",
        courses: [
          { code: "ENG 110", description: "English", credits: "3 Cr" },
          { code: "MTH 110", description: "Business Mathematics", credits: "3 Cr" },
          { code: "ICT 110", description: "IT for Business", credits: "3 Cr" },
          { code: "BHS 110", description: "Behavioral Science", credits: "3 Cr" },
          { code: "MGT 111", description: "Principles of Management", credits: "3 Cr" },
          { code: "PRC 110", description: "Software Skills Practicum", credits: "1 Cr" },
        ],
      },
      {
        label: "Sem II",
        courses: [
          { code: "BUC 201", description: "Business Communication", credits: "3 Cr" },
          { code: "MTH 111", description: "Business Mathematics II", credits: "3 Cr" },
          { code: "ECO 110", description: "Introduction to Microeconomics", credits: "3 Cr" },
          { code: "MGT 112", description: "Fundamentals of Organizational Behavior", credits: "3 Cr" },
          { code: "ACC 110", description: "Financial Accounting", credits: "3 Cr" },
          { code: "PRC 111", description: "Soft Skills Practicum", credits: "1 Cr" },
        ],
      },
      {
        label: "Sem III",
        courses: [
          { code: "STT 110", description: "Business Statistics", credits: "3 Cr" },
          { code: "ECO 111", description: "Introduction to Macroeconomics", credits: "3 Cr" },
          { code: "ACC 111", description: "Cost and Management Accounting", credits: "3 Cr" },
          { code: "FIN 110", description: "Human Resource Management", credits: "3 Cr" },
          { code: "MKT 110", description: "Principles of Marketing", credits: "3 Cr" },
          { code: "PRC 112", description: "Digital Marketing Practicum", credits: "1 Cr" },
        ],
      },
      {
        label: "Sem IV",
        courses: [
          { code: "STT 111", description: "Data Analysis and Modeling", credits: "3 Cr" },
          { code: "MGT 116", description: "Fundamentals of Operations Management", credits: "3 Cr" },
          { code: "RCH 110", description: "Business Research Methods", credits: "3 Cr" },
          { code: "MIS 110", description: "Management Information System", credits: "3 Cr" },
          { code: "FIN 111", description: "Introduction to Financial Management", credits: "3 Cr" },
          { code: "PRC 114", description: "Academic Writing", credits: "1 Cr" },
        ],
      },
      {
        label: "Sem V",
        courses: [
          { code: "FIN 352", description: "Corporate Finance", credits: "3 Cr" },
          { code: "FIN 437", description: "Financial Institutions and Market", credits: "3 Cr" },
          { code: "MIS 111", description: "Essentials of e-Business", credits: "3 Cr" },
          { code: "N/A", description: "Concentration I", credits: "3 Cr" },
          { code: "N/A", description: "Concentration II", credits: "3 Cr" },
          { code: "PRC 113", description: "Fintech Practicum", credits: "1 Cr" },
        ],
      },
      {
        label: "Sem VI",
        courses: [
          { code: "MGT 115", description: "Entrepreneurship and Innovation", credits: "3 Cr" },
          { code: "FIN 440", description: "Fundamentals of Investment Management", credits: "3 Cr" },
          { code: "PRJ 110", description: "Project Work", credits: "3 Cr" },
          { code: "N/A", description: "Concentration III", credits: "3 Cr" },
          { code: "N/A", description: "Concentration IV", credits: "3 Cr" },
          { code: "N/A", description: "Elective I", credits: "3 Cr" },
        ],
      },
      {
        label: "Sem VII",
        courses: [
          { code: "MGT 119", description: "Strategic Management", credits: "3 Cr" },
          { code: "MGT 120", description: "Business Environment", credits: "3 Cr" },
          { code: "LAW 211", description: "Financial Law", credits: "3 Cr" },
          { code: "N/A", description: "Concentration V", credits: "3 Cr" },
          { code: "N/A", description: "Elective II", credits: "3 Cr" },
          { code: "PRJ 112", description: "Community Engagement Project", credits: "1 Cr" },
        ],
      },
      {
        label: "Sem VIII",
        courses: [
          { code: "INT 110", description: "Internship", credits: "6 Cr" },
        ],
      },
    ],
    coordinator: {
      name: "Hari Adhikari",
      initials: "HA",
      image: "/assets/img/people/leader_hariadhikari.jpg",
      role: "BBA-Finance Coordinator",
      quote:
        "Finance is the language every business speaks, and at PCM our BBA-Finance programme makes sure you speak it fluently. You will pair a rigorous Pokhara University curriculum with practical exposure to banking, markets and investment.",
    },
  },
  {
    slug: "bcsit",
    badge: "BCSIT",
    shortName: "BCSIT",
    fullName: "Bachelor in Computer System and Information Technology",
    tagline:
      "A four-year, eight-semester degree merging information technology with business management to meet the evolving demands of modern organisations.",
    image: "/assets/img/program-bcsit.jpg",
    imageAlt: "BCSIT program at PCM",
    overviewTitle: "Why study BCSIT at PCM?",
    overviewBody: [
      "The Bachelor of Computer System and Information Technology (BCSIT) at Pokhara University is a comprehensive four-year, eight-semester degree. The programme merges the fields of information technology and business management to meet the evolving demands of modern businesses.",
      "The curriculum focuses on cultivating strong information technology expertise and professional practice — supported by non-credit courses each semester that track market demand for technology and skills, plus guest lectures, workshops and an internship.",
    ],
    concentrations: [
      { title: "Computing", description: "Deepen your knowledge and sharpen your skills in computing." },
      { title: "Data Science", description: "Deepen your knowledge and sharpen your skills in data science." },
      { title: "Networking & Cyber Security", description: "Deepen your knowledge and sharpen your skills in networking and cyber security." },
      { title: "Multimedia Technology", description: "Deepen your knowledge and sharpen your skills in multimedia technology." },
    ],
    careers: [
      "Software Developer", "System Analyst", "Network Administrator", "Data Scientist",
      "Database Manager", "IT Consultant", "QA Analyst", "Information Analyst",
    ],
    admissionRequirements: [
      {
        title: "Higher Secondary Education (10+2)",
        detail: "A-Level, IB or an equivalent recognised by Pokhara University, followed by the PU entrance examination.",
      },
    ],
    quickFacts: {
      level: "Bachelor",
      duration: "4 Years",
      semesters: 8,
      creditHours: 127,
      eligibility: "10+2 / A-Level",
      affiliation: "Pokhara Univ.",
    },
    totalCredits: "127 Credit Hours",
    curriculum: [
      {
        label: "Sem I",
        courses: [
          { code: "ENG 111", description: "English", credits: "3 Cr" },
          { code: "MTH 113", description: "Mathematics", credits: "3 Cr" },
          { code: "CMP 173", description: "Internet Technology", credits: "3 Cr" },
          { code: "CMP 171", description: "Fundamentals of Computer Systems", credits: "3 Cr" },
          { code: "CMP 172", description: "Programming Language", credits: "3 Cr" },
        ],
      },
      {
        label: "Sem II",
        courses: [
          { code: "ENG 112", description: "Business Communication", credits: "3 Cr" },
          { code: "MTH 114", description: "Mathematics II", credits: "3 Cr" },
          { code: "CMP 174", description: "Digital Systems", credits: "3 Cr" },
          { code: "CMP 175", description: "Object-Oriented Language (Java)", credits: "3 Cr" },
          { code: "CMP 176", description: "Data Structure and Algorithm", credits: "3 Cr" },
          { code: "PRJ 181", description: "Project I", credits: "2 Cr" },
        ],
      },
      {
        label: "Sem III",
        courses: [
          { code: "STT 220", description: "Probability and Statistics", credits: "3 Cr" },
          { code: "CMP 271", description: "Database Management System", credits: "3 Cr" },
          { code: "CMP 272", description: "Object-Oriented Analysis and Design", credits: "3 Cr" },
          { code: "CMP 273", description: "Internet Technology II (Programming)", credits: "3 Cr" },
          { code: "MGT 222", description: "Principles of Management", credits: "3 Cr" },
        ],
      },
      {
        label: "Sem IV",
        courses: [
          { code: "CMP 275", description: "Computer Architecture and Microprocessor", credits: "3 Cr" },
          { code: "CMP 274", description: "Numerical Methods", credits: "3 Cr" },
          { code: "CMP 276", description: "Software Engineering and Project Management", credits: "3 Cr" },
          { code: "CMP 277", description: "Data Communication and Networks", credits: "3 Cr" },
          { code: "FIN 222", description: "Fundamentals of Financial Management", credits: "3 Cr" },
          { code: "PRJ 281", description: "Project II", credits: "2 Cr" },
        ],
      },
      {
        label: "Sem V",
        courses: [
          { code: "MKT 351", description: "Digital Marketing", credits: "3 Cr" },
          { code: "CMP 381", description: "Operating Systems", credits: "3 Cr" },
          { code: "MGT 322", description: "Organizational Behavior", credits: "3 Cr" },
          { code: "CMP 471", description: "Artificial Intelligence", credits: "3 Cr" },
          { code: "N/A", description: "Concentration I", credits: "3 Cr" },
        ],
      },
      {
        label: "Sem VI",
        courses: [
          { code: "CMP 384", description: "Computer Graphics", credits: "3 Cr" },
          { code: "RCH 322", description: "Research Methods", credits: "3 Cr" },
          { code: "CMP 382", description: "Cloud Computing", credits: "3 Cr" },
          { code: "ECO 322", description: "Applied Economics", credits: "3 Cr" },
          { code: "N/A", description: "Concentration II", credits: "3 Cr" },
        ],
      },
      {
        label: "Sem VII",
        courses: [
          { code: "MGT 422", description: "Strategic Management", credits: "3 Cr" },
          { code: "MGT 423", description: "Management of Human Resources", credits: "3 Cr" },
          { code: "CMP 383", description: "Digital Economy", credits: "3 Cr" },
          { code: "CMP 475", description: "Information System Security", credits: "3 Cr" },
          { code: "PRJ 481", description: "Major Project", credits: "4 Cr" },
          { code: "N/A", description: "Concentration III", credits: "3 Cr" },
        ],
      },
      {
        label: "Sem VIII",
        courses: [
          { code: "LAW 422", description: "Legal Aspects of Business and Technology", credits: "3 Cr" },
          { code: "MGT 424", description: "Innovation and Entrepreneurship", credits: "3 Cr" },
          { code: "INT 494", description: "Internship", credits: "5 Cr" },
          { code: "N/A", description: "Concentration IV", credits: "3 Cr" },
        ],
      },
    ],
    coordinator: {
      name: "Er. Hari Prasad Baral",
      initials: "HB",
      image: "/assets/img/people/leader_haribaral.jpg",
      role: "BCSIT Coordinator",
      quote:
        "Technology changes fast, and our BCSIT programme is designed to keep you ahead of that change. You will learn to think like an engineer — not just code — through hands-on labs, projects and real industry exposure.",
    },
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}

export function getOtherPrograms(slug: string): Program[] {
  return programs.filter((p) => p.slug !== slug);
}
