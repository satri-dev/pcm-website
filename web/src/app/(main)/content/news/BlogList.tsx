"use client";

import { useEffect, useState } from "react";

interface Blog {
  _id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  status: string;
  excerpt: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogResponse {
  items: Blog[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch(
          "/api/admin/media/blogs?page=1&pageSize=8&status=published",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const result: BlogResponse = await response.json();

        console.log("BLOG API RESPONSE:", result);

        setBlogs(result.items);
      } catch (error) {
        console.error(error);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">News & Announcements</h1>

        <p className="mt-2 text-gray-600">
          Latest news, announcements and updates.
        </p>
      </div>

      {blogs.length === 0 ? (
        <p>No published blogs found.</p>
      ) : (
        <div className="space-y-12">
          {blogs.map((blog) => (
            <article key={blog._id} className="border-b pb-10">
              {/* Blog Header */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold">{blog.title}</h2>

                <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                  <span>By {blog.author}</span>

                  <span>•</span>

                  <span>{blog.category}</span>

                  <span>•</span>

                  <span>
                    {new Date(blog.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* HTML Content */}
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: blog.excerpt,
                }}
              />

              {/* PDF */}
              {blog.fileUrl && (
                <div className="mt-8">
                  <a
                    href={blog.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    View {blog.fileName || "Document"}
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
