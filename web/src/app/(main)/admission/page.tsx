import type { Metadata } from "next";
import AdmissionClient from "./AdmissionClient";

export const metadata: Metadata = {
  title: "Admission Process & Application | Pokhara College of Management",
  description:
    "Admission process, required documents and application form for BBA, BBA-Finance and BCSIT at Pokhara College of Management.",
  openGraph: {
    title: "Admission Process & Application | Pokhara College of Management",
    description:
      "Admission process, required documents and application form for BBA, BBA-Finance and BCSIT at Pokhara College of Management.",
    url: "https://www.pcm.edu.np/admission",
    siteName: "Pokhara College of Management",
    locale: "en_US",
    type: "website",
    images: ["https://www.pcm.edu.np/assets/img/admission-open-2026.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Admission Process & Application | Pokhara College of Management",
    description:
      "Admission process, required documents and application form for BBA, BBA-Finance and BCSIT at Pokhara College of Management.",
    images: ["https://www.pcm.edu.np/assets/img/admission-open-2026.png"],
  },
};

export default function AdmissionPage() {
  return <AdmissionClient />;
}
