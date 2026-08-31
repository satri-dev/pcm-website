"use server";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ChevronRight, Send } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { connection } from "next/server";
import { getFooterSettings, getFooterLinks } from "@/lib/data/footer";

function CurrentYear() {
  return <>{new Date().getFullYear()}</>;
}

export default async function Footer() {
  await connection();
  const settings = await getFooterSettings();
  const footerLinks = await getFooterLinks();
  
  // Use settings or fallback to defaults
  const logoUrl = settings?.logoUrl || "/images/logo-pcm.png";
  const tagline = settings?.tagline || "Enter to Learn — Go Forth to Serve. Affordable, quality management & IT education in the heart of Pokhara since 2002.";
  const address = settings?.address || "Gyan Marg, Nadipur, Pokhara-2, Kaski, Nepal";
  const phone = settings?.phone || "(061) 544761, 570124";
  const email = settings?.email || "info@pcm.edu.np";
  const mapUrl = settings?.mapUrl || "https://maps.google.com/?q=Pokhara+College+of+Management+Nadipur";
  const facebookUrl = settings?.facebookUrl || "https://www.facebook.com/239069093193587";
  const instagramUrl = settings?.instagramUrl || "https://www.instagram.com/";
  const linkedinUrl = settings?.linkedinUrl || "https://www.linkedin.com/";
  const whatsappNumber = settings?.whatsappNumber || "97761544761";
  const weekdaysHours = settings?.weekdaysHours || "6:00 AM – 4:00 PM";
  const saturdayHours = settings?.saturdayHours || "Closed";
  const affiliationText = settings?.affiliationText || "Affiliated to Pokhara University";
  const affiliationBadge = settings?.affiliationBadge || "PU";
  const newsletterTitle = settings?.newsletterTitle || "Stay in the Loop";
  const newsletterDescription = settings?.newsletterDescription || "Monthly highlights — events, scholarships and results. No spam, unsubscribe anytime.";
  const copyrightText = settings?.copyrightText || "Pokhara College of Management. All rights reserved.";
  const developerName = settings?.developerName || "SATRI (satritech.com)";
  const developerUrl = settings?.developerUrl || "https://satritech.com";

  // Calculate grid columns based on number of link sections (1-4 sections + brand column)
  const linkSectionsCount = footerLinks.length;
  const gridCols = linkSectionsCount === 0 
    ? "lg:grid-cols-[1.4fr_1fr]" 
    : linkSectionsCount === 1 
    ? "lg:grid-cols-[1.4fr_1fr_1fr]" 
    : linkSectionsCount === 2 
    ? "lg:grid-cols-[1.4fr_1fr_1fr_1fr]" 
    : "lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]";

  return (
    <footer className="relative bg-pcm-blue-900 text-white/72 overflow-hidden">
      {/* Decorative peaks SVG */}
      <svg 
        className="relative w-full h-30" 
        viewBox="0 0 1440 180" 
        preserveAspectRatio="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 180 L0 90 L240 30 L480 110 L720 20 L960 120 L1200 40 L1440 100 L1440 180Z" fill="#4167C9" opacity=".25"/>
        <path d="M0 180 L0 120 L300 70 L600 140 L900 60 L1200 130 L1440 80 L1440 180Z" fill="#14265A" opacity=".5"/>
      </svg>

      <div className="relative z-2">
        <div className="container px-4 sm:px-6">
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-8 sm:gap-10 lg:gap-[clamp(2rem,4vw,3rem)] py-8 sm:py-10 lg:py-[clamp(2.5rem,5vw,4rem)] pb-10 sm:pb-12`}>
            {/* Brand Column */}
            <div className="grid gap-4 content-start">
              <Link href="/" className="inline-flex items-center gap-3 w-fit">
                <Image
                  src={logoUrl}
                  alt="PCM"
                  width={40}
                  height={40}
                  className="rounded-lg w-10 h-10"
                />
                <span className="flex flex-col leading-tight">
                  <b className="text-white text-lg font-bold">PCM</b>
                  <span className="text-[0.62rem] tracking-[0.22em] uppercase text-white font-mono">
                    Pokhara College of Mgmt
                  </span>
                </span>
              </Link>

              <p className="text-sm sm:text-[0.92rem] leading-relaxed max-w-[34ch]">
                {tagline}
              </p>

              {/* Newsletter */}
              <div className="grid gap-3 sm:gap-[0.85rem] content-start">
                <h4 className="text-white font-mono font-semibold text-xs sm:text-[0.82rem] tracking-[0.08em] uppercase">
                  {newsletterTitle}
                </h4>
                <form className="grid grid-cols-[1fr_auto] gap-2 sm:gap-[0.55rem] mt-[0.2rem]">
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Your email address"
                    aria-label="Email address"
                    required
                    className="w-full min-w-0 px-3 sm:px-4 py-2.5 sm:py-[0.72rem] border border-white/22 rounded-lg sm:rounded-xl bg-white/6 text-white text-sm sm:text-[0.9rem] placeholder:text-white/45 outline-none transition-all focus:border-pcm-green focus:bg-white/10"
                  />
                  <button 
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="inline-flex items-center gap-[0.45rem] px-3 sm:px-[1.15rem] py-2.5 sm:py-[0.72rem] rounded-lg sm:rounded-xl bg-pcm-green text-pcm-navy font-bold text-sm sm:text-[0.9rem] transition-all hover:bg-pcm-green-500 hover:-translate-y-0.5"
                  >
                    <span className="hidden sm:inline">Subscribe</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-xs sm:text-[0.8rem] text-white/55 leading-relaxed">
                  {newsletterDescription}
                </p>
              </div>

              {/* Contact Info */}
              <div className="grid gap-2 sm:gap-[0.65rem] text-sm sm:text-[0.9rem]">
                <a 
                  href={mapUrl}
                  target="_blank" 
                  rel="noopener"
                  className="inline-flex items-start gap-2 text-white/70 transition-colors hover:text-pcm-green"
                >
                  <MapPin className="w-4 h-4 mt-[0.15rem] text-pcm-green shrink-0" />
                  <span>{address}</span>
                </a>
                <a 
                  href={`tel:${phone.replace(/[^0-9]/g, '')}`}
                  className="inline-flex items-start gap-2 text-white/70 transition-colors hover:text-pcm-green"
                >
                  <Phone className="w-4 h-4 mt-[0.15rem] text-pcm-green shrink-0" />
                  <span>{phone}</span>
                </a>
                <a 
                  href={`mailto:${email}`}
                  className="inline-flex items-start gap-2 text-white/70 transition-colors hover:text-pcm-green"
                >
                  <Mail className="w-4 h-4 mt-[0.15rem] text-pcm-green shrink-0" />
                  <span>{email}</span>
                </a>
              </div>

              {/* Social Links */}
              <div className="flex gap-2 sm:gap-[0.6rem] mt-1">
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener"
                  aria-label="Facebook"
                  className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center rounded-full border border-white/18 text-white transition-all hover:bg-pcm-green hover:border-pcm-green hover:text-pcm-navy hover:-translate-y-0.75"
                >
                  <FaFacebook className="w-4 h-4 sm:w-[1.05rem] sm:h-[1.05rem]" />
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener"
                  aria-label="Instagram"
                  className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center rounded-full border border-white/18 text-white transition-all hover:bg-pcm-green hover:border-pcm-green hover:text-pcm-navy hover:-translate-y-0.75"
                >
                  <FaInstagram className="w-4 h-4 sm:w-[1.05rem] sm:h-[1.05rem]" />
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener"
                  aria-label="LinkedIn"
                  className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center rounded-full border border-white/18 text-white transition-all hover:bg-pcm-green hover:border-pcm-green hover:text-pcm-navy hover:-translate-y-0.75"
                >
                  <FaLinkedin className="w-4 h-4 sm:w-[1.05rem] sm:h-[1.05rem]" />
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener"
                  aria-label="WhatsApp"
                  className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center rounded-full border border-white/18 text-white transition-all hover:bg-pcm-green hover:border-pcm-green hover:text-pcm-navy hover:-translate-y-0.75"
                >
                  <FaWhatsapp className="w-4 h-4 sm:w-[1.05rem] sm:h-[1.05rem]" />
                </a>
              </div>
            </div>

            {/* Dynamic Footer Link Sections */}
            {footerLinks.map((section) => (
              <div key={section.id}>
                <h4 className="text-white font-mono font-semibold text-xs sm:text-[0.82rem] tracking-[0.08em] uppercase mb-3 sm:mb-4">
                  {section.title}
                </h4>
                <div className="grid gap-2 sm:gap-[0.55rem]">
                  {section.links.map((link, idx) => {
                    if (link.external) {
                      return (
                        <a
                          key={idx}
                          href={link.href}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex items-center gap-2 text-sm sm:text-[0.92rem] text-white/70 transition-all hover:text-pcm-green hover:pl-[0.35rem]"
                        >
                          <ChevronRight className="w-3 h-3 sm:w-[0.85rem] sm:h-[0.85rem] text-pcm-green shrink-0" />
                          {link.label}
                        </a>
                      );
                    }
                    return (
                      <Link
                        key={idx}
                        href={link.href}
                        className="inline-flex items-center gap-2 text-sm sm:text-[0.92rem] text-white/70 transition-all hover:text-pcm-green hover:pl-[0.35rem]"
                      >
                        <ChevronRight className="w-3 h-3 sm:w-[0.85rem] sm:h-[0.85rem] text-pcm-green shrink-0" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Opening Hours - Always show as last column */}
            <div>
              <h4 className="text-white font-mono font-semibold text-xs sm:text-[0.82rem] tracking-[0.08em] uppercase mb-3 sm:mb-4">
                Opening Hours
              </h4>
              <div className="grid gap-1 text-xs sm:text-[0.88rem]">
                <div className="flex items-center justify-between gap-4 py-2 sm:py-[0.55rem] border-b border-white/[0.14]">
                  <span className="text-white/60 font-mono text-[0.65rem] sm:text-[0.72rem] uppercase tracking-widest">
                    Sunday – Friday
                  </span>
                  <b className="text-white font-semibold text-xs sm:text-sm">{weekdaysHours}</b>
                </div>
                <div className="flex items-center justify-between gap-4 py-2 sm:py-[0.55rem]">
                  <span className="text-white/60 font-mono text-[0.65rem] sm:text-[0.72rem] uppercase tracking-widest">
                    Saturday
                  </span>
                  <b className="text-white font-semibold text-xs sm:text-sm">{saturdayHours}</b>
                </div>
              </div>

              {/* Affiliation Badge */}
              <div className="mt-4 sm:mt-5 flex items-center gap-3 pt-4 border-t border-white/10">
                <span className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 shrink-0 border border-pcm-green rounded-md font-display font-bold text-base text-pcm-green">
                  {affiliationBadge}
                </span>
                <div className="text-xs sm:text-[0.78rem] text-white/55 leading-tight">
                  {affiliationText.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="relative z-2 border-t border-white/10">
        <div className="container px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center sm:justify-between gap-3 text-xs sm:text-[0.82rem] text-white/50 text-center sm:text-left">
            <span>
              © <CurrentYear /> {copyrightText}
            </span>
            <span className="inline-flex items-center gap-2">
              <Link href="/terms" className="text-white/70 hover:text-pcm-green transition-colors">
                Terms &amp; Services
              </Link>
              <span className="text-white/30">·</span>
              <Link href="/privacy" className="text-white/70 hover:text-pcm-green transition-colors">
                Privacy Policy
              </Link>
            </span>
            <span className="text-white/50">
              Developed by{" "}
              <a 
                href={developerUrl}
                target="_blank" 
                rel="noopener"
                className="text-white/70 hover:text-pcm-green transition-colors"
              >
                {developerName}
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
