import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Link from "next/link";
import "../about.css";
import { SectionHead } from "../legacy/section-head";
import { CtaBand } from "../legacy/cta-band";
import { LeaderList } from "./LeaderList";
import { getPageCopy, getSection } from "@/lib/data/page-content";

export const metadata: Metadata = {
  title: "Words from our leaders | Pokhara College of Management",
  description:
    "Words from our leaders — personal messages from the Principal, Chairperson, Advisor and program coordinators of Pokhara College of Management.",
  alternates: { canonical: "/about/message" },
};

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export default async function MessagePage() {
  const content = await getPageCopy("about/message");
  const hero = (content as any)?.hero ?? {
    title: "Words from our leaders",
    subtitle: "A personal welcome from the leadership team at Pokhara College of Management.",
  };
  
  const introSection = await getSection(content, "intro", null);
  const intro = introSection ?? {
    key: "intro",
    eyebrow: "Leadership voices",
    title: "Words from our leaders",
    subtitle: "The people guiding PCM share why they believe in our mission of affordable, quality education.",
  };
  
  const ctaSection = await getSection(content, "cta", null);
  const cta = ctaSection ?? {
    key: "cta",
    title: "A step towards your future",
    paragraphs: [
      "Applications for the 2083 intake are open across all three programs. Take the first step today.",
    ],
  };

  return (
    <div className={poppins.variable}>
      <div className="pcm-about">
        <main id="main">
          <section className="page-hero">
            <svg
              className="page-hero__peaks"
              viewBox="0 0 1440 400"
              preserveAspectRatio="xMidYMax slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
              <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
            </svg>
            <div className="wrap-wide page-hero__inner">
              <nav className="crumbs" aria-label="Breadcrumb">
                <Link href="/">Home</Link>{" "}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>{" "}
                <span>Words from our leaders</span>
              </nav>
              <h1>{hero.title}</h1>
              <p>{hero.subtitle}</p>
            </div>
          </section>
          <section className="section">
            <div className="wrap-wide">
              <SectionHead
                eyebrow={intro.eyebrow || ""}
                title={intro.title || "Words from our leaders"}
                subtitle={intro.subtitle || ""}
              />
              <LeaderList />
            </div>
          </section>
          <CtaBand
            title={cta.title || "A step towards your future"}
            text={cta.paragraphs?.[0] || "Applications for the 2083 intake are open across all three programs. Take the first step today."}
            primary={{ label: "Apply Now", href: "/admission" }}
            secondary={{ label: "Explore Programs", href: "/programs" }}
          />
        </main>
      </div>
    </div>
  );
}
