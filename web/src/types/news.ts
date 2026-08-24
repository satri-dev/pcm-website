export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "Achievement" | "Announcement" | "News" | "Event";
  featuredImage?: string;
  author: string;
  publishedDate: string;
  status: "published" | "draft" | "archived";
  views: number;
  featured: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NewsFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage?: string;
  author: string;
  publishedDate: string;
  status: string;
  featured: boolean;
  tags?: string;
}
