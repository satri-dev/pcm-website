// src/types/nav-menu.ts
// Canonical schema mirrors the "nav-menus" collection validator in
// scripts/create-nav-menu-collection.js

export type NavMenuType = "link" | "dropdown" | "mega";

export interface NavLinkItem {
  label: string;
  href: string;
}

export interface NavColumn {
  label: string;
  links: NavLinkItem[];
}

export const NAV_MENU_TYPES: readonly NavMenuType[] = [
  "link",
  "dropdown",
  "mega",
];

export const NAV_MENU_COLLECTION = "nav-menus";

// Navbar settings (logo & CTA button)
export interface NavbarSettings {
  logoUrl: string;
  ctaLabel: string;
  ctaHref: string;
  ctaEnabled: boolean;
}

// UI-facing shape.
export interface NavMenuItem {
  id: string;
  label: string;
  type: NavMenuType;
  href?: string;
  children: NavLinkItem[];
  columns: NavColumn[];
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

// Database document shape ("nav-menus" collection)
export interface NavMenuItemDocument {
  _id?: import("mongodb").ObjectId;
  label: string;
  type: NavMenuType;
  href?: string;
  children: NavLinkItem[];
  columns: NavColumn[];
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

// Payload accepted by the repository when creating. Normalizable fields
// (children, columns, order, active) get defaults before writing so the
// strict collection validator always passes.
export interface NavMenuCreateInput {
  label: string;
  type: NavMenuType;
  href?: string;
  children?: NavLinkItem[];
  columns?: NavColumn[];
  order?: number;
  active?: boolean;
}

export type NavMenuUpdateInput = Partial<NavMenuCreateInput>;