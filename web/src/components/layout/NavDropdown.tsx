"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

type NavLink = { label: string; href: string };

export default function NavDropdown({
  label,
  href,
  items,
}: {
  label: string;
  href: string;
  items: NavLink[];
}) {
  const pathname = usePathname();
  const isActive = pathname === href || items.some(item => pathname === item.href);

  return (
    <li className="relative group">
      <Link
        href={href}
        className={`inline-flex items-center gap-[0.35rem] px-[0.85rem] py-[0.6rem] text-[0.925rem] font-semibold rounded-md transition-colors ${
          isActive 
            ? "text-pcm-blue bg-pcm-blue/10" 
            : "text-pcm-navy hover:text-pcm-blue hover:bg-pcm-blue/10"
        }`}
      >
        {label}
        <ChevronDown className="w-[0.8rem] h-[0.8rem] transition-transform group-hover:rotate-180" />
      </Link>
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-[0.65rem] min-w-57.5 p-[0.55rem] bg-white border border-border rounded-2xl shadow-pcm-md opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all z-50">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-[0.85rem] py-[0.6rem] rounded-md text-[0.9rem] font-semibold transition-colors ${
              pathname === item.href
                ? "bg-pcm-blue/10 text-pcm-blue"
                : "text-pcm-navy hover:bg-pcm-blue/10 hover:text-pcm-blue"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </li>
  );
}
