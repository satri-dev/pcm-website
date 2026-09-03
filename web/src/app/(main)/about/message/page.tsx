import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Link from "next/link";
import "../about.css";
import { SectionHead } from "../legacy/section-head";
import { CtaBand } from "../legacy/cta-band";
import { LeaderList } from "./LeaderList";
import type { Leader } from "./LeaderCard";
import { getMessageSettings } from "@/lib/data/message-page-settings";
import { getPublishedMessages } from "@/lib/data/messages";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getMessageSettings();
  const canonical = "https://www.pcm.edu.np/about/message";
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: "Pokhara College of Management",
      title: settings.seoTitle,
      description: settings.seoDescription,
      locale: "en_US",
      images: [{ url: settings.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description: settings.seoDescription,
      images: [settings.ogImage],
    },
  };
}

function toLeaderInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

export default async function MessagePage() {
  const [settings, messages] = await Promise.all([
    getMessageSettings(),
    getPublishedMessages(),
  ]);

  const leaders: Leader[] = messages.map((m) => ({
    photo: m.photo,
    chip: toLeaderInitials(m.author),
    eyebrow: m.title,
    name: m.author,
    role: m.role,
    text: m.text,
  }));

  return (
    <div className={poppins.variable}>
      <div className="pcm-about">
        <main id="main">
          {/* ── Hero ── */}
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
              <h1>{settings.heroTitle}</h1>
              <p>{settings.heroSubtitle}</p>
            </div>
          </section>

          {/* ── Intro section ── */}
          <section className="section">
            <div className="wrap-wide">
              <SectionHead
                eyebrow={settings.introEyebrow}
                title={settings.introTitle}
                subtitle={settings.introSubtitle}
              />
              <LeaderList leaders={leaders} />
            </div>
          </section>

          {/* ── CTA band ── */}
          <CtaBand
            title={settings.ctaTitle}
            text={settings.ctaText}
            primary={{ label: settings.ctaPrimaryLabel, href: settings.ctaPrimaryHref }}
            secondary={{ label: settings.ctaSecondaryLabel, href: settings.ctaSecondaryHref }}
          />
        </main>
      </div>
    </div>
  );
}
