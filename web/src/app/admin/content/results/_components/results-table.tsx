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
import { Result } from "@/types/results";
import { Eye, Pencil, Trash2, Search, RefreshCw, FileText } from "lucide-react";

interface ResultsTableProps {
  results: Result[];
  loading?: boolean;
  onView: (result: Result) => void;
  onEdit: (result: Result) => void;
  onDelete: (result: Result) => void;
}

export default function ResultsTable({
  results,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: ResultsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const filteredResults = results.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesProgram =
      programFilter === "all" || item.program === programFilter;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesProgram && matchesStatus;
  });

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredResults.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
      <div className="flex items-center gap-3 p-5 border-b border-[var(--admin-line)] flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none"
          />
          <Input
            type="text"
            placeholder="Search results..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={programFilter}
          onValueChange={(value) => setProgramFilter(value || "all")}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All programs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All programs</SelectItem>
            <SelectItem value="BBA">BBA</SelectItem>
            <SelectItem value="BCSIT">BCSIT</SelectItem>
            <SelectItem value="BBA-Finance">BBA-Finance</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value || "all")}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-[var(--admin-muted)] ml-auto">
          <b>{filteredResults.length}</b> total
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2 text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                TITLE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                PROGRAM
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                DATE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                VIEWS
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                FILE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                STATUS
              </TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <RefreshCw
                      size={32}
                      className="opacity-40 mb-4 animate-spin"
                    />
                    <p>Loading results…</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedResults.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <Search size={40} className="opacity-30 mb-4" />
                    <p>No results match your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedResults.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-[#fafbfe] transition-colors"
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="avatar-sm">
                        {item.title.substring(0, 2).toUpperCase()}
                      </span>
                      <div className="cell-main">
                        <div className="font-semibold text-sm">
                          {item.title}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="badge badge--blue">{item.program}</span>
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    {formatDate(item.date)}
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    {item.views.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-3">
                    {item.fileName ? (
                      <span className="inline-flex items-center gap-1 text-sm text-[var(--admin-brand)]">
                        <FileText size={14} />
                        <span className="max-w-[120px] truncate inline-block">
                          {item.fileName}
                        </span>
                      </span>
                    ) : (
                      <span className="text-sm text-[var(--admin-muted)]">
                        —
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`badge badge--${
                        item.status === "published" ? "green" : "gold"
                      } lowercase`}
                    >
                      {item.status}
                    </span>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredResults.length > 0 && (
        <div className="flex items-center justify-between p-5 border-t border-[var(--admin-line)] flex-wrap gap-3">
          <div className="text-sm text-[var(--admin-muted)]">
            Showing {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, filteredResults.length)} of{" "}
            <b>{filteredResults.length}</b>
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
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
