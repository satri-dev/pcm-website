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
import { BlogStudent } from "@/types/blog-student";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  Check,
  Undo2,
  FileText,
} from "lucide-react";

interface BlogStudentTableProps {
  items: BlogStudent[];
  onView: (item: BlogStudent) => void;
  onEdit: (item: BlogStudent) => void;
  onDelete: (item: BlogStudent) => void;
  onToggleStatus: (item: BlogStudent) => void;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
}

export default function BlogStudentTable({
  items,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  selectedIds = new Set<string>(),
  onSelectionChange,
}: BlogStudentTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const statuses = useMemo(() => {
    const counter: Record<string, number> = {};
    items.forEach((item) => {
      counter[item.status] = (counter[item.status] ?? 0) + 1;
    });
    return counter;
  }, [items]);

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pageIds = useMemo(() => filtered.map((item) => item.id), [filtered]);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const somePageSelected = pageIds.some((id) => selectedIds.has(id));

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
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
    if (!onSelectionChange) return;
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  };

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
      <div className="flex items-center gap-3 p-5 border-b border-[var(--admin-line)] flex-wrap">
        <div className="relative flex-1 min-w-[280px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none"
          />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "all")}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              All statuses ({items.length})
            </SelectItem>
            <SelectItem value="pending">Pending ({statuses.pending ?? 0})</SelectItem>
            <SelectItem value="approved">Approved ({statuses.approved ?? 0})</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-[var(--admin-muted)] ml-auto">
          <b>{filtered.length}</b> total
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] bg-[var(--admin-surface-2)]">
                {onSelectionChange && (
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    ref={(el) => {
                      if (el)
                        el.indeterminate =
                          somePageSelected && !allPageSelected;
                    }}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-[var(--admin-line)] accent-[var(--admin-brand)] cursor-pointer"
                  />
                )}
              </TableHead>
              <TableHead className="w-1/2 text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                TITLE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                AUTHOR
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                CATEGORY
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                DATE
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
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <FileText size={40} className="opacity-30 mb-4" />
                    <p>No student articles match your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-[#fafbfe] transition-colors"
                >
                  <TableCell className="py-3 w-[50px]">
                    {onSelectionChange && (
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => handleToggleRow(item.id)}
                        className="h-4 w-4 rounded border-[var(--admin-line)] accent-[var(--admin-brand)] cursor-pointer"
                      />
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt=""
                          className="h-12 w-20 shrink-0 rounded-lg object-cover border border-(--admin-line)"
                        />
                      ) : (
                        <span className="avatar-sm shrink-0">
                          {item.title.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                      <div className="cell-main">
                        <div className="font-semibold text-sm">{item.title}</div>
                        <small className="text-[var(--admin-muted)] text-[0.76rem]">
                          /blogs-student/{item.slug}
                          {item.tag ? ` · ${item.tag}` : ""}
                        </small>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm py-3">{item.author}</TableCell>
                  <TableCell className="text-sm py-3">
                    <span className="badge badge--blue">{item.category || "Other"}</span>
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    {formatDate(item.date)}
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <span
                      className={`badge ${item.status === "approved" ? "badge--green" : "badge--gold"}`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="row-actions justify-end">
                      <button
                        type="button"
                        className="act-btn"
                        onClick={() => onToggleStatus(item)}
                        title={
                          item.status === "approved"
                            ? "Move back to pending"
                            : "Approve"
                        }
                      >
                        {item.status === "approved" ? (
                          <Undo2 size={15} />
                        ) : (
                          <Check size={15} />
                        )}
                      </button>
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
    </div>
  );
}