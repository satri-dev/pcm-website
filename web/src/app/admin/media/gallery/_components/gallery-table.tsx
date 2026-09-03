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
import { Gallery, GALLERY_CATEGORIES } from "@/types/gallery";
import { Eye, Pencil, Trash2, Search, ImageIcon, Video } from "lucide-react";
import { youtubeId } from "./gallery-video-form-modal";

interface GalleryTableProps {
  gallery: Gallery[];
  onAdd: () => void;
  onView: (item: Gallery) => void;
  onEdit: (item: Gallery) => void;
  onDelete: (gallery: Gallery) => void;
}

export default function GalleryTable({
  gallery,
  onAdd,
  onView,
  onEdit,
  onDelete,
}: GalleryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const filteredGallery = gallery.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.photos || []).some((p) =>
        (p.title || "").toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      (item.videos || []).some((v) =>
        (v.title || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredGallery.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGallery = filteredGallery.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isEmpty = paginatedGallery.length === 0;

  return (
    <div>
      <div className="flex items-center gap-3 p-5 border-b border-[var(--admin-line)] flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none"
          />
          <Input
            type="text"
            placeholder="Search gallery..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value || "all")}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {GALLERY_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-sm text-[var(--admin-muted)] ml-auto">
          <b>{filteredGallery.length}</b> total
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2 text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                TITLE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                CATEGORY
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                DATE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                PHOTOS
              </TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <ImageIcon size={40} className="opacity-30 mb-4" />
                    <p>No gallery items match your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedGallery.map((item) => {
                const isVideo = item.type === "video";
                const subCount = isVideo
                  ? (item.videos || []).length
                  : (item.photos || []).length;
                return (
                  <TableRow key={item.id} className="hover:bg-[#fafbfe] transition-colors">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-[var(--admin-line)] flex-shrink-0 bg-[var(--admin-surface-2)] flex items-center justify-center">
                          {isVideo ? (
                            (() => {
                              const id = youtubeId(item.videos?.[0]?.url || "");
                              return id ? (
                                <img
                                  src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <Video size={18} className="text-[var(--admin-muted)]" />
                              );
                            })()
                          ) : (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}
                        </div>
                        <div className="cell-main">
                          <div className="font-semibold text-sm">{item.title}</div>
                          <small className="text-[var(--admin-muted)] text-[0.76rem]">
                            {isVideo
                              ? `${subCount} video${subCount === 1 ? "" : "s"}`
                              : `${subCount} photos`}
                          </small>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm py-3">
                      <span className="badge badge--blue">{item.category}</span>
                      {isVideo && (
                        <span className="badge badge--violet ml-1">Video</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm py-3">{formatDate(item.date)}</TableCell>
                    <TableCell className="text-sm py-3">{item.photoCount}</TableCell>
                    <TableCell className="py-3">
                      <div className="row-actions justify-end">
                        <button
                          type="button"
                          className="act-btn"
                          onClick={() => onView(item)}
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
                           onClick={() => onDelete(item)}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {filteredGallery.length > 0 && (
        <div className="flex items-center justify-between p-5 border-t border-[var(--admin-line)] flex-wrap gap-3">
          <div className="text-sm text-[var(--admin-muted)]">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredGallery.length)} of{" "}
            <b>{filteredGallery.length}</b>
          </div>

          <div className="flex gap-3 items-center">
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(val) => {
                setItemsPerPage(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / page</SelectItem>
                <SelectItem value="8">8 / page</SelectItem>
                <SelectItem value="12">12 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <button
                type="button"
                className="admin-btn admin-btn--sm min-w-[36px]"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    className={"admin-btn admin-btn--sm min-w-[36px] " + (currentPage === pageNum ? "admin-btn--primary" : "")}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                className="admin-btn admin-btn--sm min-w-[36px]"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
