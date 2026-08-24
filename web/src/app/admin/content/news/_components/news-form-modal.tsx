"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { News, NewsFormData } from "@/types/news";
import { Save } from "lucide-react";

const newsSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(1, "Excerpt is required").max(300, "Excerpt too long"),
  content: z.string().min(1, "Content is required"),
  category: z.enum(["Achievement", "Announcement", "News", "Event"]),
  featuredImage: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  publishedDate: z.string().min(1, "Published date is required"),
  status: z.enum(["published", "draft", "archived"]),
  featured: z.boolean(),
  tags: z.string().optional(),
});

type NewsSchema = z.infer<typeof newsSchema>;

interface NewsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news: News | null;
  onSave: (news: News) => void;
}

export default function NewsFormModal({
  open,
  onOpenChange,
  news,
  onSave,
}: NewsFormModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewsSchema>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "News",
      featuredImage: "",
      author: "Admin",
      publishedDate: new Date().toISOString().split("T")[0],
      status: "draft",
      featured: false,
      tags: "",
    },
  });

  // Auto-generate slug from title
  const titleValue = watch("title");
  useEffect(() => {
    if (!news && titleValue) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 100);
      setValue("slug", slug);
    }
  }, [titleValue, news, setValue]);

  // Load news data when editing
  useEffect(() => {
    if (news) {
      reset({
        title: news.title,
        slug: news.slug,
        excerpt: news.excerpt,
        content: news.content,
        category: news.category,
        featuredImage: news.featuredImage || "",
        author: news.author,
        publishedDate: news.publishedDate,
        status: news.status,
        featured: news.featured,
        tags: news.tags?.join(", ") || "",
      });
    } else {
      reset({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "News",
        featuredImage: "",
        author: "Admin",
        publishedDate: new Date().toISOString().split("T")[0],
        status: "draft",
        featured: false,
        tags: "",
      });
    }
  }, [news, reset]);

  const onSubmit = (data: NewsSchema) => {
    const newsData: News = {
      id: news?.id || `news-${Date.now()}`,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      featuredImage: data.featuredImage,
      author: data.author,
      publishedDate: data.publishedDate,
      status: data.status,
      views: news?.views || 0,
      featured: data.featured,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      createdAt: news?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newsData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          maxWidth: "800px",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <DialogHeader>
          <DialogTitle>{news ? "Edit News" : "Add News"}</DialogTitle>
          <DialogDescription>
            {news
              ? "Update the news article details below."
              : "Create a new news article by filling out the form below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: "1.25rem" }}>
          {/* Title */}
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <Label htmlFor="title">
              Title <span style={{ color: "var(--admin-red)" }}>*</span>
            </Label>
            <Input id="title" {...register("title")} placeholder="Enter news title" />
            {errors.title && (
              <span style={{ fontSize: "0.8rem", color: "var(--admin-red)" }}>
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Slug */}
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <Label htmlFor="slug">
              URL Slug <span style={{ color: "var(--admin-red)" }}>*</span>
            </Label>
            <Input id="slug" {...register("slug")} placeholder="news-article-slug" />
            {errors.slug && (
              <span style={{ fontSize: "0.8rem", color: "var(--admin-red)" }}>
                {errors.slug.message}
              </span>
            )}
            <span style={{ fontSize: "0.75rem", color: "var(--admin-muted)" }}>
              Lowercase letters, numbers, and hyphens only
            </span>
          </div>

          {/* Two column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {/* Category */}
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <Label htmlFor="category">
                Category <span style={{ color: "var(--admin-red)" }}>*</span>
              </Label>
              <Select
                value={watch("category")}
                onValueChange={(value) =>
                  setValue("category", value as NewsSchema["category"])
                }
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Achievement">Achievement</SelectItem>
                  <SelectItem value="Announcement">Announcement</SelectItem>
                  <SelectItem value="News">News</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <span style={{ fontSize: "0.8rem", color: "var(--admin-red)" }}>
                  {errors.category.message}
                </span>
              )}
            </div>

            {/* Status */}
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <Label htmlFor="status">
                Status <span style={{ color: "var(--admin-red)" }}>*</span>
              </Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value as NewsSchema["status"])}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <span style={{ fontSize: "0.8rem", color: "var(--admin-red)" }}>
                  {errors.status.message}
                </span>
              )}
            </div>
          </div>

          {/* Two column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {/* Author */}
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <Label htmlFor="author">
                Author <span style={{ color: "var(--admin-red)" }}>*</span>
              </Label>
              <Input id="author" {...register("author")} placeholder="Author name" />
              {errors.author && (
                <span style={{ fontSize: "0.8rem", color: "var(--admin-red)" }}>
                  {errors.author.message}
                </span>
              )}
            </div>

            {/* Published Date */}
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <Label htmlFor="publishedDate">
                Published Date <span style={{ color: "var(--admin-red)" }}>*</span>
              </Label>
              <Input id="publishedDate" type="date" {...register("publishedDate")} />
              {errors.publishedDate && (
                <span style={{ fontSize: "0.8rem", color: "var(--admin-red)" }}>
                  {errors.publishedDate.message}
                </span>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <Label htmlFor="excerpt">
              Excerpt <span style={{ color: "var(--admin-red)" }}>*</span>
            </Label>
            <Textarea
              id="excerpt"
              {...register("excerpt")}
              placeholder="Brief summary of the article"
              rows={3}
            />
            {errors.excerpt && (
              <span style={{ fontSize: "0.8rem", color: "var(--admin-red)" }}>
                {errors.excerpt.message}
              </span>
            )}
            <span style={{ fontSize: "0.75rem", color: "var(--admin-muted)" }}>
              {watch("excerpt")?.length || 0}/300 characters
            </span>
          </div>

          {/* Content */}
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <Label htmlFor="content">
              Content <span style={{ color: "var(--admin-red)" }}>*</span>
            </Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Full article content (supports HTML)"
              rows={8}
            />
            {errors.content && (
              <span style={{ fontSize: "0.8rem", color: "var(--admin-red)" }}>
                {errors.content.message}
              </span>
            )}
          </div>

          {/* Featured Image */}
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              {...register("featuredImage")}
              placeholder="/assets/img/news-image.jpg"
            />
            <span style={{ fontSize: "0.75rem", color: "var(--admin-muted)" }}>
              Optional: Path to featured image
            </span>
          </div>

          {/* Tags */}
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              {...register("tags")}
              placeholder="Admission, BBA, Achievement (comma-separated)"
            />
            <span style={{ fontSize: "0.75rem", color: "var(--admin-muted)" }}>
              Optional: Comma-separated tags
            </span>
          </div>

          {/* Featured Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <label className="switch">
              <input
                type="checkbox"
                {...register("featured")}
                checked={watch("featured")}
                onChange={(e) => setValue("featured", e.target.checked)}
              />
              <span className="track"></span>
            </label>
            <Label htmlFor="featured" style={{ cursor: "pointer" }}>
              Mark as featured article
            </Label>
          </div>

          <DialogFooter>
            <button
              type="button"
              className="admin-btn"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button type="submit" className="admin-btn admin-btn--primary">
              <Save size={16} />
              {news ? "Update News" : "Create News"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
