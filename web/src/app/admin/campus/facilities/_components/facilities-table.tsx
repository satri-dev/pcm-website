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
import { FacilityItem } from "../types/facilities";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  ImageIcon,
} from "lucide-react";

interface FacilitiesTableProps {
  facilities: FacilityItem[];
  loading?: boolean;
  onView: (facility: FacilityItem) => void;
  onEdit: (facility: FacilityItem) => void;
  onDelete: (id: string) => void;
}

export default function FacilitiesTable({
  facilities,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: FacilitiesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const filteredFacilities = facilities.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredFacilities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFacilities = filteredFacilities.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const categoryBadgeColor = (category: string) => {
    switch (category) {
      case "Learning":
        return "blue";
      case "Library":
        return "violet";
      case "IT":
        return "green";
      case "Sports":
        return "red";
      case "Student Life":
        return "gold";
      default:
        return "gray";
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-5 border-b border-[var(--admin-line)] flex-wrap">
        <div className="relative flex-1 min-w-[280px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none"
          />
          <Input
            type="text"
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>

        <Select
          value={categoryFilter}
          onValueChange={(value) => {
            setCategoryFilter(value || "all");
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="Learning">Learning</SelectItem>
            <SelectItem value="Library">Library</SelectItem>
            <SelectItem value="IT">IT</SelectItem>
            <SelectItem value="Sports">Sports</SelectItem>
            <SelectItem value="Student Life">Student Life</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value || "all");
            setCurrentPage(1);
          }}
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
          <b>{filteredFacilities.length}</b> total
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%] text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                FACILITY
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                CATEGORY
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                IMAGE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                ORDER
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                STATUS
              </TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw size={32} className="opacity-40 animate-spin" />
                    <p className="text-[var(--admin-muted)]">
                      Loading facilities…
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedFacilities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Search size={40} className="opacity-30" />
                    <p className="text-[var(--admin-muted)]">
                      No facilities match your search.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedFacilities.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-[#fafbfe] transition-colors"
                >
                  {/* Name + icon */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="avatar-sm text-base">
                        {item.icon || item.name.substring(0, 2).toUpperCase()}
                      </span>
                      <div className="cell-main">
                        <div className="font-semibold text-sm">{item.name}</div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="py-3">
                    <span
                      className={`badge badge--${categoryBadgeColor(
                        item.category,
                      )}`}
                    >
                      {item.category}
                    </span>
                  </TableCell>

                  {/* Image */}
                  <TableCell className="py-3">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-9 object-cover rounded-md border border-[var(--admin-line)]"
                      />
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm text-[var(--admin-muted)]">
                        <ImageIcon size={14} />
                        None
                      </span>
                    )}
                  </TableCell>

                  {/* Order */}
                  <TableCell className="py-3 text-sm text-[var(--admin-muted)]">
                    #{item.order}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3">
                    <span
                      className={`badge badge--${
                        item.status === "published" ? "green" : "gold"
                      } lowercase`}
                    >
                      {item.status}
                    </span>
                  </TableCell>

                  {/* Actions */}
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
      {filteredFacilities.length > 0 && (
        <div className="flex items-center justify-between p-5 border-t border-[var(--admin-line)] flex-wrap gap-3">
          <div className="text-sm text-[var(--admin-muted)]">
            Showing {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, filteredFacilities.length)} of{" "}
            <b>{filteredFacilities.length}</b>
          </div>

          <div className="flex gap-2 items-center">
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
                <SelectItem value="15">15 / page</SelectItem>
                <SelectItem value="30">30 / page</SelectItem>
              </SelectContent>
            </Select>

            <button
              type="button"
              className="admin-btn admin-btn--sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ‹ Prev
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  type="button"
                  className={`admin-btn admin-btn--sm ${
                    currentPage === page ? "admin-btn--primary" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              className="admin-btn admin-btn--sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
