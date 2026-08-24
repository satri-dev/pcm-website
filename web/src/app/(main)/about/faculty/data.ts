export type Person = {
  photo: string;
  name: string;
  role: string;
};

export const leadership: Person[] = [
  { photo: "/assets/img/people/staff_leena.jpg", name: "Ms. Leena Negi Shrestha", role: "Principal" },
  { photo: "/assets/img/people/staff_haribaral.jpg", name: "Er. Hari Baral", role: "BCSIT Coordinator" },
];

export const team: Person[] = [
  { photo: "/assets/img/people/fac_hariadhikari.jpg", name: "Mr. Hari Adhikari", role: "BBA Coordinator (Morning)" },
  { photo: "/assets/img/people/fac_saroj.jpg", name: "Mr. Saroj Kuwar", role: "BBA Coordinator (Day)" },
  { photo: "/assets/img/people/fac_manoj.jpg", name: "Mr. Manoj Shrestha", role: "Faculty Member" },
  { photo: "/assets/img/people/fac_dammar.jpg", name: "Mr. Dammar Khadayat", role: "Faculty Member" },
  { photo: "/assets/img/people/staff_shusan.jpg", name: "Mr. Shusan Poudel", role: "Administrator (Morning)" },
  { photo: "/assets/img/people/staff_agandhar.jpg", name: "Mr. Agandhar Subedi", role: "Accountant" },
  { photo: "/assets/img/people/staff_suresh.jpg", name: "Mr. Suresh Chaudhary", role: "Accountant Assist" },
  { photo: "/assets/img/people/staff_apil.jpg", name: "Mr. Apil Ghimire", role: "IT Technician" },
  { photo: "/assets/img/people/staff_tejendra.jpg", name: "Mr. Tejendra Dahal", role: "Driver / Store / Photocopy" },
  { photo: "/assets/img/people/staff_sabita.jpg", name: "Ms. Sabita K.C", role: "Executive Secretary" },
  { photo: "/assets/img/people/staff_basanta.jpg", name: "Mr. Basanta B. Basnet", role: "Office Secretary" },
  { photo: "/assets/img/people/staff_surendra.jpg", name: "Mr. Surendra Timilsena", role: "Office Assistant" },
  { photo: "/assets/img/people/staff_rupa.jpg", name: "Ms. Rupa Shris", role: "Sweeper" },
  { photo: "/assets/img/people/staff_dipa.jpg", name: "Ms. Dipa Gautam", role: "Sweeper" },
  { photo: "/assets/img/people/staff_chitra.jpg", name: "Mr. Chitra Shrestha", role: "Guard" },
  { photo: "/assets/img/people/staff_somlal.jpg", name: "Mr. Som Lal Shrestha", role: "Guard" },
  { photo: "/assets/img/people/staff_mukti.jpg", name: "Mr. Mukti Prasad Bastola", role: "Guard" },
];

export const stats = [
  { count: 80, suffix: "%", label: "Success stories" },
  { count: 100, suffix: "", label: "Dean's List Scholars" },
  { count: 1000, suffix: "", label: "Graduates" },
  { count: 23, suffix: "", label: "Years of Excellence" },
];
