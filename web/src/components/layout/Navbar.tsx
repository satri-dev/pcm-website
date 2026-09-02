"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Menu, X, ChevronDown, Phone } from "lucide-react";
import NavDropdown from "./NavDropdown";
import ThemeToggle from "./ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import type { NavMenuItem, NavbarSettings } from "@/types/nav-menu";

export default function Navbar({ items, settings }: { items: NavMenuItem[]; settings: NavbarSettings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const navLinkClass = (href: string, base = "px-[0.85rem] py-[0.6rem] text-[0.925rem] font-semibold rounded-md transition-colors") =>
    `${base} ${
      pathname === href
        ? "text-pcm-blue bg-secondary"
        : "text-pcm-navy hover:text-pcm-blue hover:bg-secondary"
    }`;

  return (
    <>
      <header className="sticky top-0 z-101 bg-white backdrop-blur-md border-b border-border shadow-sm w-full">
        <div className="container flex items-center justify-between gap-3 sm:gap-6 min-h-16 sm:min-h-18.5 w-full mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 sm:gap-3" aria-label="Pokhara College of Management — home">
            <Image
              src={settings.logoUrl || "/images/logo-pcm.png"}
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
              {items.map((item) => {
                if (item.type === "link") {
                  return (
                    <li key={item.id}>
                      <Link href={item.href || "#"} className={navLinkClass(item.href || "#")}>
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                if (item.type === "dropdown") {
                  return (
                    <NavDropdown
                      key={item.id}
                      label={item.label}
                      href={item.href || "#"}
                      items={item.children}
                    />
                  );
                }

                if (item.type === "mega") {
                  return (
                    <li key={item.id} className="relative group">
                      <span className="px-[0.85rem] py-[0.6rem] text-[0.925rem] font-semibold text-pcm-navy rounded-md hover:text-pcm-blue hover:bg-secondary transition-colors cursor-pointer inline-flex items-center gap-1">
                        {item.label} <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                      </span>
                      <div className="absolute top-full right-0 mt-2 min-w-170 p-5 bg-white rounded-xl border border-border shadow-pcm-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 grid grid-cols-4 gap-5">
                        {item.columns.map((col) => (
                          <div key={col.label}>
                            <span className="block text-[0.7rem] font-bold tracking-[0.15em] uppercase text-pcm-navy/50 mb-2">{col.label}</span>
                            <ul className="space-y-1">
                              {col.links.map((link) => (
                                <li key={`${link.label}-${link.href}`}>
                                  <Link href={link.href} className="block px-2 py-1.5 text-sm text-pcm-navy hover:text-pcm-blue hover:bg-secondary rounded-md transition-colors">
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </li>
                  );
                }

                return null;
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button aria-label="Search the site" onClick={() => setSearchOpen(true)} className="w-9 h-9 sm:w-10.5 sm:h-10.5 hidden md:inline-grid place-items-center rounded-md border border-border text-pcm-navy hover:text-pcm-blue hover:border-pcm-blue hover:bg-secondary transition-colors">
              <Search className="w-4 h-4 sm:w-[1.15rem] sm:h-[1.15rem]" />
            </button>
            {settings.ctaEnabled && (
              <Link
                href={settings.ctaHref || "/admission"}
                className={buttonVariants({ variant: "primary", className: "hidden sm:inline-flex text-sm sm:text-base px-3 sm:px-4 h-9 sm:h-10 text-white" })}
              >
                <span className="hidden sm:inline">{settings.ctaLabel || "Apply Now"}</span>
                <span className="sm:hidden">{settings.ctaLabel?.split(" ")[0] || "Apply"}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            )}
            <button
              onClick={() => {
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
        <div className="fixed inset-0 z-200 lg:hidden">
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
                  src={settings.logoUrl || "/images/logo-pcm.png"}
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
                {items.map((item) => {
                  if (item.type === "link") {
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.href || "#"}
                          className={`block px-4 py-3 text-base font-semibold rounded-lg hover:bg-secondary transition-colors ${
                            pathname === (item.href || "#")
                              ? "text-pcm-blue bg-secondary"
                              : "text-pcm-navy"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  }

                  if (item.type === "dropdown") {
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => toggleDropdown(item.id)}
                          className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-pcm-navy rounded-lg hover:bg-secondary transition-colors"
                        >
                          {item.label}
                          <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.id ? "rotate-180" : ""}`} />
                        </button>
                        {openDropdown === item.id && (
                          <ul className="mt-1 ml-4 space-y-1">
                            {item.children.map((link) => (
                              <li key={`${link.label}-${link.href}`}>
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
                    );
                  }

                  if (item.type === "mega") {
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => toggleDropdown(item.id)}
                          className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-pcm-navy rounded-lg hover:bg-secondary transition-colors"
                        >
                          {item.label}
                          <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.id ? "rotate-180" : ""}`} />
                        </button>
                        {openDropdown === item.id && (
                          <div className="mt-1 ml-4 space-y-1">
                            {item.columns.map((col) => (
                              <div key={col.label} className="pt-2">
                                <span className="block px-4 py-1 text-[0.7rem] font-bold tracking-[0.15em] uppercase text-pcm-navy/40">
                                  {col.label}
                                </span>
                                <ul className="space-y-1">
                                  {col.links.map((link) => (
                                    <li key={`${link.label}-${link.href}`}>
                                      <Link
                                        href={link.href}
                                        className="block px-4 py-2.5 text-sm text-pcm-navy/70 hover:text-pcm-blue hover:bg-secondary rounded-md transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                      >
                                        {link.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  }

                  return null;
                })}
              </ul>

              {/* Apply Button */}
              <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3">
                {settings.ctaEnabled && (
                  <Link
                    href={settings.ctaHref || "/admission"}
                    className={buttonVariants({ variant: "primary", className: "w-full justify-center" })}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {settings.ctaLabel || "Apply Now"} <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                <a
                  href="tel:061544761"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-pcm-navy hover:bg-secondary hover:text-pcm-blue transition-colors"
                >
                  <Phone className="w-4 h-4" /> Call Admissions
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-200 flex items-start justify-center pt-[15vh]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchOpen(false);
                  setSearchQuery("");
                }
              }}
              className="flex items-center border-b border-border"
            >
              <Search className="w-5 h-5 text-pcm-navy/40 ml-4 shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search programs, news, pages..."
                className="flex-1 px-4 py-4 text-base outline-none bg-transparent text-pcm-navy placeholder:text-pcm-navy/40"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="p-4 text-pcm-navy/50 hover:text-pcm-navy transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <div className="px-4 py-3 bg-gray-50 text-xs text-pcm-navy/50">
              Press Enter to search
            </div>
          </div>
        </div>
      )}
    </>
  );
}