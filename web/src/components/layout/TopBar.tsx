"use client";

import Link from "next/link";
import { Phone, Mail, ChevronDown } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="bg-pcm-dark text-white/80">
      <div className="container flex items-center justify-between gap-2 py-2 px-3 sm:px-4 lg:px-6">
        {/* Contact — visible on all screens */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-[1.1rem] text-[0.68rem] sm:text-xs lg:text-[0.8rem]">
          <a href="tel:061544761" className="inline-flex items-center gap-1 sm:gap-[0.45rem] hover:text-pcm-green transition-colors">
            <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-[0.95rem] lg:h-[0.95rem] shrink-0" />
            <span className="hidden sm:inline">(061) 544761, 570124</span>
            <span className="sm:hidden">(061) 544761</span>
          </a>
          <span className="w-px h-[1.1em] bg-white/28" />
          <a href="mailto:info@pcm.edu.np" className="inline-flex items-center gap-1 sm:gap-[0.45rem] hover:text-pcm-green transition-colors">
            <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-[0.95rem] lg:h-[0.95rem] shrink-0" />
            <span>info@pcm.edu.np</span>
          </a>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-[1.1rem] ml-auto text-[0.68rem] sm:text-xs lg:text-[0.8rem]">
          <Link href="/scholarship" className="hidden md:inline hover:text-pcm-green transition-colors whitespace-nowrap">
            Scholarships
          </Link>

          <div className="hidden md:inline-flex relative group">
            <Link href="/gpa-converter" className="inline-flex items-center gap-1 hover:text-pcm-green transition-colors whitespace-nowrap">
              GPA Converter <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[190px] p-2 bg-white rounded-xl border border-border shadow-pcm-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {["BBA", "BBA-Finance", "BCSIT"].map((p) => (
                <Link
                  key={p}
                  href={`/gpa-converter?program=${p.toLowerCase().replace(" ", "-")}`}
                  className="block px-3 py-2 rounded-md text-sm font-semibold text-pcm-navy hover:bg-secondary hover:text-pcm-blue"
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/clubs" className="hidden lg:inline hover:text-pcm-green transition-colors whitespace-nowrap">Clubs</Link>
          <Link href="/alumni" className="hidden lg:inline hover:text-pcm-green transition-colors whitespace-nowrap">Alumni</Link>
          <Link href="/login" className="hidden sm:inline hover:text-pcm-green transition-colors whitespace-nowrap">Login</Link>

          {/* Social - Hidden on mobile to save space */}
          <span className="hidden sm:inline-flex items-center gap-1.5 sm:gap-2">
            <a href="https://www.facebook.com/239069093193587" target="_blank" rel="noopener" aria-label="Facebook" className="w-6 h-6 sm:w-[26px] sm:h-[26px] grid place-items-center border border-white/20 rounded-full hover:bg-pcm-green hover:border-pcm-green hover:text-pcm-navy transition-colors">
              <FaFacebook className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener" aria-label="Instagram" className="w-6 h-6 sm:w-[26px] sm:h-[26px] grid place-items-center border border-white/20 rounded-full hover:bg-pcm-green hover:border-pcm-green hover:text-pcm-navy transition-colors">
              <FaInstagram className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </a>
          </span>

          <span className="inline-flex items-center gap-1 font-mono text-[0.65rem] sm:text-[0.72rem] text-white/55">
            <button className="text-pcm-green">EN</button> / <button className="hover:text-pcm-green">ने</button>
          </span>
        </div>
      </div>
    </div>
  );
}
