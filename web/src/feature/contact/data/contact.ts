import type { ContactInfo } from "../types";

export const contactInfoItems: ContactInfo[] = [
  {
    id: "address",
    icon: "location",
    label: "Visit us",
    value: "Gyan Marg, Nadipur, Pokhara-2, Kaski, Nepal",
    href: "https://maps.google.com/?q=Pokhara+College+of+Management+Nadipur",
  },
  {
    id: "phone",
    icon: "phone",
    label: "Call us",
    value: "(061) 544761, 570124",
    href: "tel:061544761",
  },
  {
    id: "email",
    icon: "email",
    label: "Email us",
    value: "info@pcm.edu.np",
    href: "mailto:info@pcm.edu.np",
  },
  {
    id: "hours",
    icon: "hours",
    label: "Opening hours",
    value: "Sun–Fri: 6:00 AM – 4:00 PM · Sat: Closed",
  },
];

export const subjectOptions = [
  "Admissions enquiry",
  "Program information",
  "Scholarships",
  "Campus visit",
  "Other",
];

export const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Pokhara%20College%20of%20Management%20Nadipur%20Pokhara&t=&z=15&ie=UTF8&iwloc=&output=embed";
