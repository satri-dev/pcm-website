import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Link from "next/link";
import "../about.css";
import { SectionHead } from "../legacy/section-head";
import { CheckList } from "../legacy/check-list";
import { CtaBand } from "../legacy/cta-band";
import { RevealBox } from "../legacy/reveal-box";
import { ArrowRightIcon } from "../legacy/icons";
import { CampusMapExplorer, type CampusMapLandmark } from "./CampusMapExplorer";
import { getCampusMapSettings } from "@/lib/data/campus-map-page-settings";
import { getPublishedLandmarks } from "@/lib/data/campus-map";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCampusMapSettings();
  const canonical = "https://www.pcm.edu.np/about/campus-map";
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

export default async function CampusMapPage() {
  const [settings, landmarks] = await Promise.all([
    getCampusMapSettings(),
    getPublishedLandmarks(),
  ]);

  const explorerLandmarks: CampusMapLandmark[] = landmarks.map((l) => ({
    id: l.id,
    name: l.name,
    category: l.category,
    icon: l.icon,
    x: l.x,
    y: l.y,
    desc: l.description,
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
                <Link href="/about">About</Link>{" "}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>{" "}
                <span>Campus Map</span>
              </nav>
              <h1>{settings.heroTitle}</h1>
              <p>{settings.heroSubtitle}</p>
            </div>
          </section>

          {/* ── Explore section ── */}
          <section className="section">
            <div className="wrap-wide">
              <div className="section-head-row">
                <SectionHead
                  eyebrow={settings.exploreEyebrow}
                  title={settings.exploreTitle}
                  subtitle={settings.exploreSubtitle}
                />
                <a
                  className="btn btn-ghost reveal is-inview"
                  href={settings.facilitiesButtonHref}
                >
                  {settings.facilitiesButtonLabel} <ArrowRightIcon />
                </a>
              </div>
              <CampusMapExplorer landmarks={explorerLandmarks} />
            </div>
          </section>

          {/* ── Location split ── */}
          <section className="section section--soft">
            <div className="wrap-wide split">
              <RevealBox className="split__media">
                <div
                  style={{
                    borderRadius: 22,
                    overflow: "hidden",
                    boxShadow: "var(--shadow-lg)",
                    aspectRatio: "4/3",
                  }}
                >
                  <img
                    src={settings.locationImage}
                    alt={settings.locationImageAlt}
                    loading="lazy"
                  />
                </div>
                <div className="est-badge">
                  <b>{settings.locationBadgeValue}</b>
                  <span>{settings.locationBadgeLabel}</span>
                </div>
              </RevealBox>
              <RevealBox className="split__content">
                <span className="eyebrow">{settings.locationEyebrow}</span>
                <h2 className="section-title">{settings.locationTitle}</h2>
                <p className="mt-4">{settings.locationParagraph}</p>
                {settings.locationChecklist.length > 0 && (
                  <CheckList
                    className="check-list mt-5"
                    items={settings.locationChecklist}
                  />
                )}
                <a
                  className="btn btn-primary mt-6"
                  href={settings.directionsButtonHref}
                  target="_blank"
                  rel="noopener"
                >
                  {settings.directionsButtonLabel} <ArrowRightIcon />
                </a>
              </RevealBox>
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
