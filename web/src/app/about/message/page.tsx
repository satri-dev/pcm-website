import type { Metadata } from "next";
import "../legacy/legacy.css";
import { PageHero } from "../legacy/page-hero";
import { SectionHead } from "../legacy/section-head";
import { CtaBand } from "../legacy/cta-band";
import { LeaderCard } from "./LeaderCard";
import { leaders } from "./data";

export const metadata: Metadata = {
  title: "Words from our leaders | Pokhara College of Management",
  description:
    "Words from our leaders — personal messages from the Principal, Chairperson, Advisor and program coordinators of Pokhara College of Management.",
  alternates: { canonical: "/about/message" },
};

export default function MessagePage() {
  return (
    <main id="main">
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Words from our leaders" }]}
        title="Words from our leaders"
        subtitle="A personal welcome from the leadership team at Pokhara College of Management."
      />
      <section className="section">
        <div className="wrap-wide">
          <SectionHead
            eyebrow="Leadership voices"
            title="Words from our leaders"
            subtitle="The people guiding PCM share why they believe in our mission of affordable, quality education."
          />
          <div className="leader-stack">
            {leaders.map((leader, i) => (
              <LeaderCard key={leader.name} leader={leader} index={i} />
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        title="A step towards your future"
        text="Applications for the 2083 intake are open across all three programs. Take the first step today."
        primary={{ label: "Apply Now", href: "/admission.html" }}
        secondary={{ label: "Explore Programs", href: "/programs.html" }}
      />
    </main>
  );
}
