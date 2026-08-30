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
import { NavMenuItem } from "@/types/nav-menu";
import {
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface NavMenuTableProps {
  items: NavMenuItem[];
  loading?: boolean;
  onEdit: (item: NavMenuItem) => void;
  onDelete: (item: NavMenuItem) => void;
  onMove: (index: number, direction: -1 | 1) => void;
}

function typeLabel(type: NavMenuItem["type"]) {
  switch (type) {
    case "link":
      return "Link";
    case "dropdown":
      return "Dropdown";
    case "mega":
      return "Mega Menu";
    default:
      return type;
  }
}

function itemDetail(item: NavMenuItem) {
  if (item.type === "dropdown") {
    return `${item.children.length} link${item.children.length === 1 ? "" : "s"}`;
  }
  if (item.type === "mega") {
    const links = item.columns.reduce((n, col) => n + col.links.length, 0);
    return `${item.columns.length} column${item.columns.length === 1 ? "" : "s"} · ${links} links`;
  }
  return item.href || "—";
}

export default function NavMenuTable({
  items,
  loading = false,
  onEdit,
  onDelete,
  onMove,
}: NavMenuTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.label
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [items, searchQuery, typeFilter]);

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
            placeholder="Search navbar items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value || "all")}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="link">Link</SelectItem>
            <SelectItem value="dropdown">Dropdown</SelectItem>
            <SelectItem value="mega">Mega Menu</SelectItem>
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
              <TableHead className="w-[88px] text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                ORDER
              </TableHead>
              <TableHead className="w-[38%] text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                LABEL
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                TYPE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">
                CONTENTS
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
                  <div className="flex flex-col items-center">
                    <RefreshCw size={32} className="opacity-40 mb-4 animate-spin" />
                    <p>Loading navbar items…</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <Search size={40} className="opacity-30 mb-4" />
                    <p>
                      {items.length === 0
                        ? "No navbar items yet. Add your first one."
                        : "No navbar items match your search."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => {
                const realIndex = items.indexOf(item);
                const canUp = realIndex > 0;
                const canDown = realIndex < items.length - 1;
                return (
                  <TableRow key={item.id} className="hover:bg-[#fafbfe] transition-colors">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-[var(--admin-muted)] min-w-[22px]">
                          {item.order}
                        </span>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            className="act-btn"
                            disabled={!canUp}
                            title="Move up"
                            onClick={() => onMove(realIndex, -1)}
                          >
                            <ChevronUp size={13} />
                          </button>
                          <button
                            type="button"
                            className="act-btn"
                            disabled={!canDown}
                            title="Move down"
                            onClick={() => onMove(realIndex, 1)}
                          >
                            <ChevronDown size={13} />
                          </button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <span className="avatar-sm">{item.label.substring(0, 2).toUpperCase()}</span>
                        <div className="cell-main">
                          <div className="font-semibold text-sm">{item.label}</div>
                          {item.href && (
                            <small className="text-[var(--admin-muted)] text-[0.76rem]">
                              {item.href}
                            </small>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="badge badge--blue">{typeLabel(item.type)}</span>
                    </TableCell>
                    <TableCell className="text-sm text-[var(--admin-muted)] py-3">
                      {itemDetail(item)}
                    </TableCell>
                    <TableCell className="py-3">
                      <span className={`badge badge--${item.active ? "green" : "gray"}`}>
                        {item.active ? "Active" : "Hidden"}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="row-actions justify-end">
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
    </div>
  );
}