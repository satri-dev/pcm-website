"use server";

import Link from "next/link";
import { Phone, Mail, ChevronDown } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { listTopBarLinks, getTopBarContact } from "@/lib/data/topbar";

export default async function TopBar() {
  const [links, contact] = await Promise.all([
    listTopBarLinks(),
    getTopBarContact(),
  ]);

  return (
    <div className="bg-pcm-blue-900 text-white/80">
      <div className="container flex items-center justify-between gap-2 py-2 px-3 sm:px-4 lg:px-6">
        {/* Contact — visible on all screens */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-[1.1rem] text-[0.68rem] sm:text-xs lg:text-[0.8rem]">
          <a
            href={`tel:${contact?.phone || "061544761"}`}
            className="inline-flex items-center gap-1 sm:gap-[0.45rem] hover:text-pcm-green transition-colors"
          >
            <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-[0.95rem] lg:h-[0.95rem] shrink-0" />
            <span className="hidden sm:inline">
              {contact?.phoneDisplay || "(061) 544761, 570124"}
            </span>
            <span className="sm:hidden">
              {contact?.phone || "(061) 544761"}
            </span>
          </a>
          <span className="w-px h-[1.1em] bg-white/28" />
          <a
            href={`mailto:${contact?.email || "info@pcm.edu.np"}`}
            className="inline-flex items-center gap-1 sm:gap-[0.45rem] hover:text-pcm-green transition-colors"
          >
            <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-[0.95rem] lg:h-[0.95rem] shrink-0" />
            <span>{contact?.email || "info@pcm.edu.np"}</span>
          </a>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-[1.1rem] ml-auto text-[0.68rem] sm:text-xs lg:text-[0.8rem]">
          {/* Dynamic Links */}
          {links.map((link) => (
            <div key={link.id}>
              {link.type === "simple" ? (
                <Link
                  href={link.href}
                  className="hidden md:inline hover:text-pcm-green transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ) : (
                <div className="hidden md:inline-flex relative group">
                  <button 
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-pcm-green transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none text-inherit"
                  >
                    {link.label}{" "}
                    <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[190px] p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[110] pointer-events-none group-hover:pointer-events-auto">
                    {link.dropdownItems?.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        className="block px-3 py-2.5 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Social - Hidden on mobile to save space */}
          <span className="hidden sm:inline-flex items-center gap-1.5 sm:gap-2">
            <a
              href={
                contact?.facebookUrl ||
                "https://www.facebook.com/239069093193587"
              }
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
              className="w-6 h-6 sm:w-[26px] sm:h-[26px] grid place-items-center border border-white/20 rounded-full hover:bg-pcm-green hover:border-pcm-green hover:text-pcm-navy transition-colors"
            >
              <FaFacebook className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </a>
            <a
              href={contact?.instagramUrl || "https://www.instagram.com"}
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              className="w-6 h-6 sm:w-[26px] sm:h-[26px] grid place-items-center border border-white/20 rounded-full hover:bg-pcm-green hover:border-pcm-green hover:text-pcm-navy transition-colors"
            >
              <FaInstagram className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </a>
          </span>

          <span className="inline-flex items-center gap-1 font-mono text-[0.65rem] sm:text-[0.72rem] text-white/55">
            <button className="text-pcm-green">EN</button> /{" "}
            <button className="hover:text-pcm-green">ने</button>
          </span>
        </div>
      </div>
    </div>
  );
}
