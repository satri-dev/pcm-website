"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { News } from "@/types/news";
import { Eye, Pencil, Trash2, Search } from "lucide-react";

interface NewsTableProps {
  news: News[];
  onEdit: (news: News) => void;
  onDelete: (id: string) => void;
}

export default function NewsTable({ news, onEdit, onDelete }: NewsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Filter news
  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "1rem 1.25rem",
          borderBottom: "1px solid var(--admin-line)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: "1 1 300px" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--admin-muted)",
            }}
          />
          <Input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger style={{ width: "160px" }}>
            <SelectValue placeholder="All category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All category</SelectItem>
            <SelectItem value="Achievement">Achievement</SelectItem>
            <SelectItem value="Announcement">Announcement</SelectItem>
            <SelectItem value="News">News</SelectItem>
            <SelectItem value="Event">Event</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger style={{ width: "140px" }}>
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--admin-muted)",
            marginLeft: "auto",
          }}
        >
          <b>{filteredNews.length}</b> total
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: "50%" }}>TITLE</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>VIEWS</TableHead>
              <TableHead>FEATURED</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead style={{ textAlign: "right" }}>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedNews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center", padding: "3rem" }}>
                  <div className="empty">
                    <Search size={40} style={{ opacity: 0.3, marginBottom: "1rem" }} />
                    <p>No news articles match your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedNews.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                      <span
                        className="avatar-sm"
                        style={{
                          background: "var(--admin-brand)",
                          color: "#fff",
                        }}
                      >
                        {item.title.substring(0, 2).toUpperCase()}
                      </span>
                      <div className="cell-main">
                        <div style={{ fontWeight: 600, fontSize: "0.87rem" }}>{item.title}</div>
                        <small>{item.category}</small>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell style={{ fontSize: "0.87rem" }}>{formatDate(item.publishedDate)}</TableCell>
                  <TableCell style={{ fontSize: "0.87rem" }}>{item.views.toLocaleString()}</TableCell>
                  <TableCell>
                    {item.featured ? (
                      <span className="badge badge--green">Yes</span>
                    ) : (
                      <span className="badge badge--gray">No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`badge badge--${
                        item.status === "published"
                          ? "green"
                          : item.status === "draft"
                            ? "gold"
                            : "gray"
                      }`}
                      style={{ textTransform: "lowercase" }}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="row-actions" style={{ justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        className="act-btn"
                        onClick={() => {
                          /* View logic */
                        }}
                        title="View"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        className="act-btn"
                        onClick={() => onEdit(item)}
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className="act-btn danger"
                        onClick={() => onDelete(item.id)}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredNews.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.25rem",
            borderTop: "1px solid var(--admin-line)",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div style={{ fontSize: "0.85rem", color: "var(--admin-muted)" }}>
            Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredNews.length)} of{" "}
            <b>{filteredNews.length}</b>
          </div>

          <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(val) => {
                setItemsPerPage(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger style={{ width: "110px" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / page</SelectItem>
                <SelectItem value="8">8 / page</SelectItem>
                <SelectItem value="12">12 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
              </SelectContent>
            </Select>

            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button
                type="button"
                className="admin-btn admin-btn--sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ minWidth: "36px" }}
              >
                ‹
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    className={`admin-btn admin-btn--sm ${currentPage === pageNum ? "admin-btn--primary" : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{ minWidth: "36px" }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                className="admin-btn admin-btn--sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ minWidth: "36px" }}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
