export const PAGE_CONTENT_COLLECTION = "page-content";

export interface PageContentSection {
  key: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  paragraphs?: string[];
  checklist?: string[];
}

export interface PageContent {
  id: string;
  slug: string;
  label: string;
  hero: { title: string; subtitle: string };
  sections: PageContentSection[];
  updatedAt: string;
}

export interface PageContentDocument {
  _id?: import("mongodb").ObjectId;
  slug: string;
  label: string;
  hero: { title: string; subtitle: string };
  sections: PageContentSection[];
  updatedAt: Date;
}

export interface PageContentInput {
  label?: string;
  hero?: { title: string; subtitle: string };
  sections?: PageContentSection[];
}