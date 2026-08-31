import type { ObjectId } from "mongodb";

export interface TopBarLink {
  id: string;
  label: string;
  href: string;
  order: number;
  status: "active" | "inactive";
  type: "simple" | "dropdown";
  dropdownItems?: TopBarDropdownItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TopBarDropdownItem {
  label: string;
  href: string;
}

export interface TopBarContact {
  id: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  updatedAt: Date;
}

export interface TopBarDocument extends Omit<TopBarLink, "id"> {
  _id: ObjectId;
}

export interface TopBarContactDocument extends Omit<TopBarContact, "id"> {
  _id: ObjectId;
}

export interface TopBarLinkCreateInput {
  label: string;
  href: string;
  order: number;
  status: "active" | "inactive";
  type: "simple" | "dropdown";
  dropdownItems?: TopBarDropdownItem[];
}

export interface TopBarLinkUpdateInput extends Partial<TopBarLinkCreateInput> {}

export interface TopBarContactUpdateInput {
  phone?: string;
  phoneDisplay?: string;
  email?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}
