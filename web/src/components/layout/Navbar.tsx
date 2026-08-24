import Link from "next/link";
import Image from "next/image";
import { Moon, Search, ArrowRight, Menu } from "lucide-react";
import NavDropdown from "./NavDropdown";
import { buttonVariants } from "@/components/ui/button";

const aboutLinks = [
  { label: "About PCM", href: "/about" },
  { label: "Words from our leaders", href: "/about/message" },
  { label: "Board of Directors", href: "/about/board" },
  { label: "Faculty & Staff", href: "/about/faculty" },
  { label: "Campus & Facilities", href: "/about/facility" },
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
  return (
    <header className="sticky top-0 z-[100] bg-white backdrop-blur-md border-b border-border shadow-sm w-full">
      <div className="container flex items-center justify-between gap-6 min-h-[74px] w-full mx-auto">
        <Link href="/" className="inline-flex items-center gap-3" aria-label="Pokhara College of Management — home">
          <Image
            src="/images/logo-pcm.png"
            alt="Pokhara College of Management logo"
            width={44}
            height={44}
            className="rounded-[10px] object-contain"
          />
          <span className="flex flex-col leading-[1.1]">
            <b className="font-display text-[1.12rem] text-pcm-navy tracking-wide">PCM</b>
            <span className="font-mono text-[0.62rem] tracking-[0.22em] uppercase text-pcm-blue">
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

        <div className="flex items-center gap-3">
          <button aria-label="Switch to dark mode" className="w-[42px] h-[42px] hidden md:inline-grid place-items-center rounded-md border border-border text-pcm-navy hover:text-pcm-blue hover:border-pcm-blue hover:bg-secondary transition-colors">
            <Moon className="w-[1.15rem] h-[1.15rem]" />
          </button>
          <button aria-label="Search the site" className="w-[42px] h-[42px] hidden md:inline-grid place-items-center rounded-md border border-border text-pcm-navy hover:text-pcm-blue hover:border-pcm-blue hover:bg-secondary transition-colors">
            <Search className="w-[1.15rem] h-[1.15rem]" />
          </button>
          <Link
            href="/admission"
            className={buttonVariants({ variant: "primary", className: "hidden sm:inline-flex" })}
          >
            Apply Now <ArrowRight className="w-4 h-4" />
          </Link>
          <button aria-label="Open menu" className="lg:hidden w-11 h-11 grid place-items-center rounded-md text-pcm-navy">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
