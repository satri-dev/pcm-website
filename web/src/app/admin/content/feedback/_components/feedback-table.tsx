"use client";

import { useMemo, useState } from "react";
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
import { Feedback } from "@/types/feedback";
import { Eye, Trash2, Search, RefreshCw, EyeOff, Star } from "lucide-react";

interface FeedbackTableProps {
  feedback: Feedback[];
  loading?: boolean;
  onView: (item: Feedback) => void;
  onDelete: (item: Feedback) => void;
}

function getField(item: Feedback, id: string) {
  return item.fields?.[id];
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function showRating(item: Feedback): number | null {
  const rating = getField(item, "rating");
  const num = Number(rating);
  if (typeof rating === "number" || (typeof rating === "string" && rating !== "")) {
    if (num >= 1 && num <= 5) return num;
  }
  return null;
}

export default function FeedbackTable({
  feedback,
  loading = false,
  onView,
  onDelete,
}: FeedbackTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [anonymousFilter, setAnonymousFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return feedback.filter((item) => {
      const fields = item.fields ?? {};
      const name = String(fields.name ?? "");
      const email = String(fields.email ?? "");
      const message =
        typeof fields.message === "string" ? fields.message : "";
      const matchesSearch =
        !q ||
        name.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        message.toLowerCase().includes(q);
      const matchesAnonymous =
        anonymousFilter === "all" ||
        (anonymousFilter === "anonymous" && item.anonymous) ||
        (anonymousFilter === "identified" && !item.anonymous);
      return matchesSearch && matchesAnonymous;
    });
  }, [feedback, searchQuery, anonymousFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-5 border-b border-[var(--admin-line)] flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none"
          />
          <Input
            type="text"
            placeholder="Search by name, email or message..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>

        <Select
          value={anonymousFilter}
          onValueChange={(value) => {
            setAnonymousFilter(value || "all");
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All submissions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All submissions</SelectItem>
            <SelectItem value="anonymous">Anonymous only</SelectItem>
            <SelectItem value="identified">Identified only</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-[var(--admin-muted)] ml-auto">
          <b>{filtered.length}</b> total
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4 text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                SUBMISSION
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                RATING
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                SUBMITTED
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                SOURCE
              </TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <RefreshCw size={32} className="opacity-40 mb-4 animate-spin" />
                    <p>Loading feedback…</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <Search size={40} className="opacity-30 mb-4" />
                    <p>No feedback found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item) => {
                const name = String(getField(item, "name") ?? "");
                const email = String(getField(item, "email") ?? "");
                const rating = showRating(item);
                const avatarLabel = item.anonymous
                  ? "A"
                  : (name || "F").substring(0, 2).toUpperCase();
                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-[#fafbfe] transition-colors"
                  >
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <span className="avatar-sm">{avatarLabel}</span>
                        <div className="cell-main">
                          <div className="font-semibold text-sm flex items-center gap-1.5">
                            {item.anonymous ? "Anonymous" : name || "Feedback"}
                            {item.anonymous && (
                              <EyeOff size={13} className="text-[var(--admin-muted)]" />
                            )}
                          </div>
                          <small className="text-[var(--admin-muted)] text-[0.76rem]">
                            {item.anonymous ? (email || "—") : (email || "No email")}
                          </small>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      {rating !== null ? (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-500">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                          {rating}/5
                        </span>
                      ) : (
                        <span className="text-[var(--admin-muted)]">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm py-3">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell className="py-3">
                      {item.anonymous ? (
                        <span className="badge badge--gray lowercase">Anonymous</span>
                      ) : (
                        <span className="badge badge--green lowercase">Identified</span>
                      )}
                    </TableCell>
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

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between p-5 border-t border-[var(--admin-line)] flex-wrap gap-3">
          <div className="text-sm text-[var(--admin-muted)]">
            Showing {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, filtered.length)} of{" "}
            <b>{filtered.length}</b>
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
                ‹
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    className={`admin-btn admin-btn--sm min-w-[36px] ${
                      currentPage === pageNum ? "admin-btn--primary" : ""
                    }`}
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
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
