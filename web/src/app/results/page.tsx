import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import ResultsClient from "./ResultsClient";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Results | Pokhara College of Management",
  description:
    "Semester results and marksheets for PCM students - published and verified by Pokhara University.",
  alternates: { canonical: "/results" },
};

export default function ResultsPage() {
  return (
    <div className={poppins.variable}>
      <ResultsClient />
    </div>
  );
}
