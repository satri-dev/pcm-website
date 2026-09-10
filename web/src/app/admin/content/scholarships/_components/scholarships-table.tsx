"use client";

import { useState, useMemo } from "react";
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
import { Scholarship } from "@/types/scholarships";
import { Eye, Pencil, Trash2, Search, RefreshCw } from "lucide-react";

interface ScholarshipsTableProps {
  scholarships: Scholarship[];
  loading?: boolean;
  onView: (scholarship: Scholarship) => void;
  onEdit: (scholarship: Scholarship) => void;
  onDelete: (scholarship: Scholarship) => void;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
}

export default function ScholarshipsTable({
  scholarships,
  loading = false,
  onView,
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
}: ScholarshipsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const filteredScholarships = scholarships.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedScholarships = filteredScholarships.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const pageIds = useMemo(
    () => paginatedScholarships.map((item) => item.id),
    [paginatedScholarships]
  );

  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const somePageSelected = pageIds.some((id) => selectedIds.has(id));

  const handleSelectAll = () => {
    if (allPageSelected) {
      const next = new Set(selectedIds);
      pageIds.forEach((id) => next.delete(id));
      onSelectionChange(next);
    } else {
      const next = new Set(selectedIds);
      pageIds.forEach((id) => next.add(id));
      onSelectionChange(next);
    }
  };

  const handleToggleRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
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
            placeholder="Search scholarships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value || "all")}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="Merit">Merit</SelectItem>
            <SelectItem value="Need-based">Need-based</SelectItem>
            <SelectItem value="University">University</SelectItem>
            <SelectItem value="Category">Category</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-[var(--admin-muted)] ml-auto">
          <b>{filteredScholarships.length}</b> total
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] bg-[var(--admin-surface-2)]">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = somePageSelected && !allPageSelected;
                  }}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-[var(--admin-line)] accent-[var(--admin-brand)] cursor-pointer"
                />
              </TableHead>
              <TableHead className="w-[40%] text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                SCHEME
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                TYPE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                ACTIVE
              </TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <RefreshCw
                      size={32}
                      className="opacity-40 mb-4 animate-spin"
                    />
                    <p>Loading scholarships…</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedScholarships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <Search size={40} className="opacity-30 mb-4" />
                    <p>No scholarships match your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedScholarships.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-[#fafbfe] transition-colors"
                >
                  <TableCell className="py-3 w-[50px]">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => handleToggleRow(item.id)}
                      className="h-4 w-4 rounded border-[var(--admin-line)] accent-[var(--admin-brand)] cursor-pointer"
                    />
                  </TableCell>
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
                    <span className="badge badge--blue">{item.type}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`badge badge--${
                        item.active ? "green" : "gray"
                      } lowercase`}
                    >
                      {item.active ? "Yes" : "No"}
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
      {filteredScholarships.length > 0 && (
        <div className="flex items-center justify-between p-5 border-t border-[var(--admin-line)] flex-wrap gap-3">
          <div className="text-sm text-[var(--admin-muted)]">
            Showing {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, filteredScholarships.length)} of{" "}
            <b>{filteredScholarships.length}</b>
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
