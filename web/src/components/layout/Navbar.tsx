"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import NavDropdown from "./NavDropdown";
import ThemeToggle from "./ThemeToggle";
import { buttonVariants } from "@/components/ui/button";

const aboutLinks = [
  { label: "About PCM", href: "/about" },
  { label: "Words from our leaders", href: "/about-message" },
  { label: "Board of Directors", href: "/about-board" },
  { label: "Faculty & Staff", href: "/faculty" },
  { label: "Campus & Facilities", href: "/facilities" },
];

const programLinks = [
  { label: "All Programs", href: "/programs" },
  { label: "BBA", href: "/program-bba" },
  { label: "BBA-Finance", href: "/program-bba-finance" },
  { label: "BCSIT", href: "/program-bcsit" },
];

const newsLinks = [
  { label: "News", href: "/news" },
  { label: "Notices", href: "/notice" },
  { label: "Results", href: "/results" },
  { label: "Events", href: "/events" },
];

const blogLinks = [
  { label: "Articles", href: "/blogs" },
  { label: "Student Blogs", href: "/blogs-student" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <>
      <header className="sticky top-0 z-[101] bg-white backdrop-blur-md border-b border-border shadow-sm w-full">
        <div className="container flex items-center justify-between gap-3 sm:gap-6 min-h-[64px] sm:min-h-[74px] w-full mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 sm:gap-3" aria-label="Pokhara College of Management — home">
            <Image
              src="/images/logo-pcm.png"
              alt="Pokhara College of Management logo"
              width={40}
              height={40}
              className="rounded-[8px] sm:rounded-[10px] object-contain w-10 h-10 sm:w-11 sm:h-11"
            />
            <span className="flex flex-col leading-[1.1]">
              <b className="font-display text-base sm:text-[1.12rem] text-pcm-navy tracking-wide">PCM</b>
              <span className="font-mono text-[0.55rem] sm:text-[0.62rem] tracking-[0.2em] sm:tracking-[0.22em] uppercase text-pcm-blue">
                Pokhara College of Mgmt
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-[0.35rem]">
              <li>
                <Link href="/" className="px-[0.85rem] py-[0.6rem] text-[0.925rem] font-semibold text-pcm-blue bg-secondary rounded-md">
                  Home
                </Link>
              </li>
              <NavDropdown label="About" href="/about" items={aboutLinks} />
              <NavDropdown label="Programs" href="/programs" items={programLinks} />
              <NavDropdown label="News" href="/news" items={newsLinks} />
              <li>
                <Link href="/gallery" className="px-[0.85rem] py-[0.6rem] text-[0.925rem] font-semibold text-pcm-navy rounded-md hover:text-pcm-blue hover:bg-secondary transition-colors">
                  Gallery
                </Link>
              </li>
              <NavDropdown label="Blogs" href="/blogs" items={blogLinks} />
              <li>
                <Link href="/contact" className="px-[0.85rem] py-[0.6rem] text-[0.925rem] font-semibold text-pcm-navy rounded-md hover:text-pcm-blue hover:bg-secondary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button aria-label="Search the site" className="w-9 h-9 sm:w-[42px] sm:h-[42px] hidden md:inline-grid place-items-center rounded-md border border-border text-pcm-navy hover:text-pcm-blue hover:border-pcm-blue hover:bg-secondary transition-colors">
              <Search className="w-4 h-4 sm:w-[1.15rem] sm:h-[1.15rem]" />
            </button>
            <Link
              href="/admission"
              className={buttonVariants({ variant: "primary", className: "hidden sm:inline-flex text-sm sm:text-base px-3 sm:px-4 h-9 sm:h-10" })}
            >
              <span className="hidden sm:inline">Apply Now</span>
              <span className="sm:hidden">Apply</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
            <button 
              onClick={() => {
                console.log('Hamburger clicked!');
                setMobileMenuOpen(true);
              }}
              aria-label="Open menu" 
              className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 grid place-items-center rounded-md text-pcm-navy hover:bg-secondary transition-colors"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute top-0 right-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-white z-10">
              <Link href="/" className="inline-flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src="/images/logo-pcm.png"
                  alt="PCM"
                  width={36}
                  height={36}
                  className="rounded-lg"
                />
                <span className="flex flex-col leading-tight">
                  <b className="font-display text-base text-pcm-navy">PCM</b>
                  <span className="font-mono text-[0.55rem] tracking-wider uppercase text-pcm-blue">
                    Pokhara College
                  </span>
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 grid place-items-center rounded-md hover:bg-secondary transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <Link 
                    href="/" 
                    className="block px-4 py-3 text-base font-semibold text-pcm-blue bg-secondary rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>

                {/* About Dropdown */}
                <li>
                  <button
                    onClick={() => toggleDropdown("About")}
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-pcm-navy rounded-lg hover:bg-secondary transition-colors"
                  >
                    About
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === "About" ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === "About" && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {aboutLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="block px-4 py-2 text-sm text-pcm-navy/80 hover:text-pcm-blue hover:bg-secondary rounded-md transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Programs Dropdown */}
                <li>
                  <button
                    onClick={() => toggleDropdown("Programs")}
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-pcm-navy rounded-lg hover:bg-secondary transition-colors"
                  >
                    Programs
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === "Programs" ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === "Programs" && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {programLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="block px-4 py-2 text-sm text-pcm-navy/80 hover:text-pcm-blue hover:bg-secondary rounded-md transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* News Dropdown */}
                <li>
                  <button
                    onClick={() => toggleDropdown("News")}
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-pcm-navy rounded-lg hover:bg-secondary transition-colors"
                  >
                    News
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === "News" ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === "News" && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {newsLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="block px-4 py-2 text-sm text-pcm-navy/80 hover:text-pcm-blue hover:bg-secondary rounded-md transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                <li>
                  <Link 
                    href="/gallery" 
                    className="block px-4 py-3 text-base font-semibold text-pcm-navy rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Gallery
                  </Link>
                </li>

                {/* Blogs Dropdown */}
                <li>
                  <button
                    onClick={() => toggleDropdown("Blogs")}
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-pcm-navy rounded-lg hover:bg-secondary transition-colors"
                  >
                    Blogs
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === "Blogs" ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === "Blogs" && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {blogLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="block px-4 py-2 text-sm text-pcm-navy/80 hover:text-pcm-blue hover:bg-secondary rounded-md transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                <li>
                  <Link 
                    href="/contact" 
                    className="block px-4 py-3 text-base font-semibold text-pcm-navy rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </li>
              </ul>

              {/* Apply Button */}
              <div className="mt-6 pt-6 border-t border-border">
                <Link
                  href="/admission"
                  className={buttonVariants({ variant: "primary", className: "w-full justify-center" })}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
