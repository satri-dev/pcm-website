"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ChevronRight, Send } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "News & Notices", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Placements", href: "/placements" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Facilities", href: "/facilities" },
  { label: "Campus Map", href: "/campus-map" },
  { label: "Results", href: "/results" },
  { label: "Downloads", href: "/downloads" },
  { label: "Blogs", href: "/blogs" },
  { label: "Gallery", href: "/gallery" },
  { label: "Career", href: "/career" },
  { label: "Virtual Tour", href: "/virtual-tour" },
];

const getInTouchLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Admission", href: "/admission" },
  { label: "Scholarships", href: "/scholarship" },
  { label: "GPA Converter", href: "/gpa-converter" },
  { label: "Clubs", href: "/clubs" },
  { label: "Alumni", href: "/alumni" },
  { label: "FAQ", href: "/faq" },
];

const usefulLinks = [
  { label: "Pokhara University", href: "https://pu.edu.np" },
  { label: "Ministry of Education", href: "https://www.moest.gov.np" },
  { label: "University Grants Commission", href: "https://www.ugcnepal.edu.np" },
  { label: "National Examination Board", href: "https://www.neb.gov.np" },
];

export default function Footer() {
  return (
    <footer className="relative bg-pcm-dark text-white/[0.72] overflow-hidden">
      {/* Decorative peaks SVG */}
      <svg 
        className="relative w-full h-[120px]" 
        viewBox="0 0 1440 180" 
        preserveAspectRatio="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 180 L0 90 L240 30 L480 110 L720 20 L960 120 L1200 40 L1440 100 L1440 180Z" fill="#4167C9" opacity=".25"/>
        <path d="M0 180 L0 120 L300 70 L600 140 L900 60 L1200 130 L1440 80 L1440 180Z" fill="#14265A" opacity=".5"/>
      </svg>

      <div className="relative z-[2]">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-8 sm:gap-10 lg:gap-[clamp(2rem,4vw,3rem)] py-8 sm:py-10 lg:py-[clamp(2.5rem,5vw,4rem)] pb-10 sm:pb-12">
            {/* Brand Column */}
            <div className="grid gap-4 content-start">
              <Link href="/" className="inline-flex items-center gap-3 w-fit">
                <Image
                  src="/images/logo-pcm.png"
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
                Enter to Learn — Go Forth to Serve. Affordable, quality management &amp; IT education in the heart of Pokhara since 2002.
              </p>

              {/* Newsletter */}
              <div className="grid gap-3 sm:gap-[0.85rem] content-start">
                <h4 className="text-white font-mono font-semibold text-xs sm:text-[0.82rem] tracking-[0.08em] uppercase">
                  Stay in the Loop
                </h4>
                <form className="grid grid-cols-[1fr_auto] gap-2 sm:gap-[0.55rem] mt-[0.2rem]">
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Your email address"
                    aria-label="Email address"
                    required
                    className="w-full min-w-0 px-3 sm:px-4 py-2.5 sm:py-[0.72rem] border border-white/[0.22] rounded-lg sm:rounded-xl bg-white/[0.06] text-white text-sm sm:text-[0.9rem] placeholder:text-white/45 outline-none transition-all focus:border-pcm-green focus:bg-white/10"
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
                  Monthly highlights — events, scholarships and results. No spam, unsubscribe anytime.
                </p>
              </div>

              {/* Contact Info */}
              <div className="grid gap-2 sm:gap-[0.65rem] text-sm sm:text-[0.9rem]">
                <a 
                  href="https://maps.google.com/?q=Pokhara+College+of+Management+Nadipur" 
                  target="_blank" 
                  rel="noopener"
                  className="inline-flex items-start gap-2 text-white/70 transition-colors hover:text-pcm-green"
                >
                  <MapPin className="w-4 h-4 mt-[0.15rem] text-pcm-green shrink-0" />
                  <span>Gyan Marg, Nadipur, Pokhara-2, Kaski, Nepal</span>
                </a>
                <a 
                  href="tel:061544761" 
                  className="inline-flex items-start gap-2 text-white/70 transition-colors hover:text-pcm-green"
                >
                  <Phone className="w-4 h-4 mt-[0.15rem] text-pcm-green shrink-0" />
                  <span>(061) 544761, 570124</span>
                </a>
                <a 
                  href="mailto:info@pcm.edu.np" 
                  className="inline-flex items-start gap-2 text-white/70 transition-colors hover:text-pcm-green"
                >
                  <Mail className="w-4 h-4 mt-[0.15rem] text-pcm-green shrink-0" />
                  <span>info@pcm.edu.np</span>
                </a>
              </div>

              {/* Social Links */}
              <div className="flex gap-2 sm:gap-[0.6rem] mt-1">
                <a
                  href="https://www.facebook.com/239069093193587"
                  target="_blank"
                  rel="noopener"
                  aria-label="Facebook"
                  className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center rounded-full border border-white/[0.18] text-white transition-all hover:bg-pcm-green hover:border-pcm-green hover:text-pcm-navy hover:-translate-y-[3px]"
                >
                  <FaFacebook className="w-4 h-4 sm:w-[1.05rem] sm:h-[1.05rem]" />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener"
                  aria-label="Instagram"
                  className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center rounded-full border border-white/[0.18] text-white transition-all hover:bg-pcm-green hover:border-pcm-green hover:text-pcm-navy hover:-translate-y-[3px]"
                >
                  <FaInstagram className="w-4 h-4 sm:w-[1.05rem] sm:h-[1.05rem]" />
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener"
                  aria-label="LinkedIn"
                  className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center rounded-full border border-white/[0.18] text-white transition-all hover:bg-pcm-green hover:border-pcm-green hover:text-pcm-navy hover:-translate-y-[3px]"
                >
                  <FaLinkedin className="w-4 h-4 sm:w-[1.05rem] sm:h-[1.05rem]" />
                </a>
                <a
                  href="https://wa.me/97761544761"
                  target="_blank"
                  rel="noopener"
                  aria-label="WhatsApp"
                  className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center rounded-full border border-white/[0.18] text-white transition-all hover:bg-pcm-green hover:border-pcm-green hover:text-pcm-navy hover:-translate-y-[3px]"
                >
                  <FaWhatsapp className="w-4 h-4 sm:w-[1.05rem] sm:h-[1.05rem]" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-mono font-semibold text-xs sm:text-[0.82rem] tracking-[0.08em] uppercase mb-3 sm:mb-4">
                Quick Links
              </h4>
              <div className="grid gap-2 sm:gap-[0.55rem]">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm sm:text-[0.92rem] text-white/70 transition-all hover:text-pcm-green hover:pl-[0.35rem]"
                  >
                    <ChevronRight className="w-3 h-3 sm:w-[0.85rem] sm:h-[0.85rem] text-pcm-green shrink-0" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Get in Touch */}
            <div>
              <h4 className="text-white font-mono font-semibold text-xs sm:text-[0.82rem] tracking-[0.08em] uppercase mb-3 sm:mb-4">
                Get in Touch
              </h4>
              <div className="grid gap-2 sm:gap-[0.55rem]">
                {getInTouchLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm sm:text-[0.92rem] text-white/70 transition-all hover:text-pcm-green hover:pl-[0.35rem]"
                  >
                    <ChevronRight className="w-3 h-3 sm:w-[0.85rem] sm:h-[0.85rem] text-pcm-green shrink-0" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Useful Links */}
            <div>
              <h4 className="text-white font-mono font-semibold text-xs sm:text-[0.82rem] tracking-[0.08em] uppercase mb-3 sm:mb-4">
                Useful Links
              </h4>
              <div className="grid gap-2 sm:gap-[0.55rem]">
                {usefulLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 text-sm sm:text-[0.92rem] text-white/70 transition-all hover:text-pcm-green hover:pl-[0.35rem]"
                  >
                    <ChevronRight className="w-3 h-3 sm:w-[0.85rem] sm:h-[0.85rem] text-pcm-green shrink-0" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Opening Hours */}
            <div>
              <h4 className="text-white font-mono font-semibold text-xs sm:text-[0.82rem] tracking-[0.08em] uppercase mb-3 sm:mb-4">
                Opening Hours
              </h4>
              <div className="grid gap-1 text-xs sm:text-[0.88rem]">
                <div className="flex items-center justify-between gap-4 py-2 sm:py-[0.55rem] border-b border-white/[0.14]">
                  <span className="text-white/60 font-mono text-[0.65rem] sm:text-[0.72rem] uppercase tracking-[0.1em]">
                    Sunday – Friday
                  </span>
                  <b className="text-white font-semibold text-xs sm:text-sm">6:00 AM – 4:00 PM</b>
                </div>
                <div className="flex items-center justify-between gap-4 py-2 sm:py-[0.55rem]">
                  <span className="text-white/60 font-mono text-[0.65rem] sm:text-[0.72rem] uppercase tracking-[0.1em]">
                    Saturday
                  </span>
                  <b className="text-white font-semibold text-xs sm:text-sm">Closed</b>
                </div>
              </div>

              {/* Affiliation Badge */}
              <div className="mt-4 sm:mt-5 flex items-center gap-3 pt-4 border-t border-white/10">
                <span className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 shrink-0 border border-pcm-green rounded-md font-display font-bold text-base text-pcm-green">
                  PU
                </span>
                <div className="text-xs sm:text-[0.78rem] text-white/55 leading-tight">
                  Affiliated to<br />
                  <b className="text-white font-semibold">Pokhara University</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="relative z-[2] border-t border-white/10">
        <div className="container px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center sm:justify-between gap-3 text-xs sm:text-[0.82rem] text-white/50 text-center sm:text-left">
            <span>
              © <span>{new Date().getFullYear()}</span> Pokhara College of Management. All rights reserved.
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
                href="https://satritech.com" 
                target="_blank" 
                rel="noopener"
                className="text-white/70 hover:text-pcm-green transition-colors"
              >
                SATRI (satritech.com)
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
