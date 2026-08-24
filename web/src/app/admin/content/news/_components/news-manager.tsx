"use client";

import { useState } from "react";
import { News } from "@/types/news";
import { Plus } from "lucide-react";
import NewsTable from "./news-table";
import NewsFormModal from "./news-form-modal";

const initialNews: News[] = [
  {
    id: "1",
    title: "BBA student Prabhat awarded Rs. 12 lakh entrepreneurship grant",
    slug: "bba-student-prabhat-grant",
    excerpt: "Fourth-year BBA student receives major funding for innovative startup",
    content: "<p>Full content here...</p>",
    category: "Achievement",
    featuredImage: "/assets/img/about-1.jpg",
    author: "Admin",
    publishedDate: "2026-07-24",
    status: "published",
    views: 4200,
    featured: true,
    tags: ["BBA", "Entrepreneurship", "Achievement"],
    createdAt: "2026-07-24T10:00:00Z",
    updatedAt: "2026-07-24T10:00:00Z",
  },
  {
    id: "2",
    title: "Annual Fest 2083 dates announced",
    slug: "annual-fest-2083",
    excerpt: "Three-day cultural extravaganza scheduled for next month",
    content: "<p>Full content here...</p>",
    category: "Announcement",
    featuredImage: "/assets/img/about-2.jpg",
    author: "Admin",
    publishedDate: "2026-07-18",
    status: "published",
    views: 3100,
    featured: false,
    tags: ["Event", "Culture"],
    createdAt: "2026-07-18T10:00:00Z",
    updatedAt: "2026-07-18T10:00:00Z",
  },
  {
    id: "3",
    title: "Admissions open for 2083 intake",
    slug: "admissions-2083",
    excerpt: "Applications now being accepted for all programs",
    content: "<p>Full content here...</p>",
    category: "News",
    author: "Admin",
    publishedDate: "2026-07-05",
    status: "published",
    views: 5400,
    featured: false,
    tags: ["Admission", "Programs"],
    createdAt: "2026-07-05T10:00:00Z",
    updatedAt: "2026-07-05T10:00:00Z",
  },
  {
    id: "4",
    title: "Guest lecture series resumes this semester",
    slug: "guest-lecture-series",
    excerpt: "Industry experts to share insights with students",
    content: "<p>Full content here...</p>",
    category: "Event",
    author: "Admin",
    publishedDate: "2026-06-28",
    status: "published",
    views: 1650,
    featured: false,
    tags: ["Education", "Guest Lecture"],
    createdAt: "2026-06-28T10:00:00Z",
    updatedAt: "2026-06-28T10:00:00Z",
  },
];

export default function NewsManager() {
  const [news, setNews] = useState<News[]>(initialNews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  const handleAddNews = () => {
    setEditingNews(null);
    setIsModalOpen(true);
  };

  const handleEditNews = (newsItem: News) => {
    setEditingNews(newsItem);
    setIsModalOpen(true);
  };

  const handleDeleteNews = (id: string) => {
    if (confirm("Are you sure you want to delete this news article?")) {
      setNews(news.filter((n) => n.id !== id));
    }
  };

  const handleSaveNews = (newsData: News) => {
    if (editingNews) {
      setNews(news.map((n) => (n.id === newsData.id ? newsData : n)));
    } else {
      setNews([newsData, ...news]);
    }
    setIsModalOpen(false);
    setEditingNews(null);
  };

  return (
    <main style={{ padding: "1.5rem" }}>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <div>
            <h3>News articles</h3>
            <p>Manage, search and edit news articles.</p>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleAddNews}
          >
            <Plus size={16} />
            Add News
          </button>
        </div>

        <div className="admin-panel__body" style={{ padding: 0 }}>
          <NewsTable
            news={news}
            onEdit={handleEditNews}
            onDelete={handleDeleteNews}
          />
        </div>
      </div>

      <NewsFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        news={editingNews}
        onSave={handleSaveNews}
      />
    </main>
  );
}
