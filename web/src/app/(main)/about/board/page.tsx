import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Link from "next/link";
import "../about.css";
import { SectionHead } from "../legacy/section-head";
import { CheckList } from "../legacy/check-list";
import { CtaBand } from "../legacy/cta-band";
import { RevealBox } from "../legacy/reveal-box";
import { BoardGrid } from "./BoardGrid";
import { getBoardSettings } from "@/lib/data/board-page-settings";
import { getPublishedBoard } from "@/lib/data/board";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getBoardSettings();
  const canonical = "https://www.pcm.edu.np/about/board";
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

export default async function BoardPage() {
  const [settings, members] = await Promise.all([
    getBoardSettings(),
    getPublishedBoard(),
  ]);

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
                <span>Board of Directors</span>
              </nav>
              <h1>{settings.heroTitle}</h1>
              <p>{settings.heroSubtitle}</p>
            </div>
          </section>

          {/* ── Board grid ── */}
          <section className="section">
            <div className="wrap-wide">
              <SectionHead
                eyebrow={settings.headEyebrow}
                title={settings.headTitle}
                subtitle={settings.headSubtitle}
              />
              <BoardGrid members={members} />
            </div>
          </section>

          {/* ── Our promise (split) ── */}
          <section className="section tone-sky">
            <div className="wrap-wide split">
              <RevealBox>
                <span className="eyebrow">{settings.promiseEyebrow}</span>
                <h2 className="section-title">{settings.promiseTitle}</h2>
                {settings.promiseParagraphs.map((p, i) => (
                  <p key={i} style={i === 0 ? { marginTop: "1rem" } : undefined}>
                    {p}
                  </p>
                ))}
                {settings.promiseChecklist.length > 0 && (
                  <div style={{ marginTop: "1.2rem" }}>
                    <CheckList className="checklist" items={settings.promiseChecklist} />
                  </div>
                )}
              </RevealBox>
              <div className="split__media">
                <div style={{ borderRadius: "22px", overflow: "hidden", boxShadow: "var(--shadow-lg)", aspectRatio: "4/3", position: "relative" }}>
                  <img
                    className="split-media-img"
                    src={settings.promiseImageSrc}
                    alt={settings.promiseImageAlt}
                    loading="lazy"
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                </div>
                <div className="est-badge">
                  <b>{settings.promiseBadgeValue}</b>
                  <span>{settings.promiseBadgeLabel}</span>
                </div>
              </div>
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
