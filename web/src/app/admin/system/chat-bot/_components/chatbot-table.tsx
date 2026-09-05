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
import { ChatbotEntry } from "../types/chatbot";
import { Eye, Pencil, Trash2, Search, RefreshCw } from "lucide-react";

interface ChatbotTableProps {
  entries: ChatbotEntry[];
  loading?: boolean;
  onView: (entry: ChatbotEntry) => void;
  onEdit: (entry: ChatbotEntry) => void;
  onDelete: (entry: ChatbotEntry) => void;
}

export default function ChatbotTable({
  entries,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: ChatbotTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const filteredEntries = entries.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some((k) =>
        k.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel =
      channelFilter === "all" || item.channel === channelFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && item.active) ||
      (statusFilter === "inactive" && !item.active);
    return matchesSearch && matchesChannel && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = filteredEntries.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const channelBadgeColor = (channel: string) => {
    switch (channel) {
      case "Website":
        return "blue";
      case "Facebook Messenger":
        return "blue";
      case "WhatsApp":
        return "green";
      case "Instagram":
        return "violet";
      case "Viber":
        return "violet";
      case "General":
        return "gray";
      default:
        return "gray";
    }
  };

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
            placeholder="Search questions, keywords, or answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={channelFilter}
          onValueChange={(value) => setChannelFilter(value || "all")}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All channels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All channels</SelectItem>
            {[...new Set(entries.map((e) => e.channel))].map((ch) => (
              <SelectItem key={ch} value={ch}>
                {ch}
              </SelectItem>
            ))}
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-[var(--admin-muted)] ml-auto">
          <b>{filteredEntries.length}</b> total
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                QUESTION
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                CHANNEL
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                KEYWORDS
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                STATUS
              </TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
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
                    <p>Loading chatbot entries...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <Search size={40} className="opacity-30 mb-4" />
                    <p>No chatbot entries match your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedEntries.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-[#fafbfe] transition-colors"
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="avatar-sm">
                        {item.question.substring(0, 2).toUpperCase()}
                      </span>
                      <div className="cell-main">
                        <div className="font-semibold text-sm">
                          {item.question}
                        </div>
                        {item.keywords.length > 0 && (
                          <div className="text-xs text-[var(--admin-muted)] mt-0.5 truncate max-w-[300px]">
                            {item.keywords.slice(0, 3).join(", ")}
                            {item.keywords.length > 3 &&
                              ` +${item.keywords.length - 3}`}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`badge badge--${channelBadgeColor(item.channel)}`}
                    >
                      {item.channel}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {item.keywords.slice(0, 2).map((kw, i) => (
                        <span
                          key={i}
                          className="badge badge--gray text-[0.7rem]"
                        >
                          {kw}
                        </span>
                      ))}
                      {item.keywords.length > 2 && (
                        <span className="badge badge--gray text-[0.7rem]">
                          +{item.keywords.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`badge badge--${item.active ? "green" : "red"}`}
                    >
                      {item.active ? "Active" : "Inactive"}
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
      {filteredEntries.length > 0 && (
        <div className="flex items-center justify-between p-5 border-t border-[var(--admin-line)] flex-wrap gap-3">
          <div className="text-sm text-[var(--admin-muted)]">
            Showing {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, filteredEntries.length)} of{" "}
            <b>{filteredEntries.length}</b>
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
                &#8249;
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    className={`admin-btn admin-btn--sm min-w-[36px] ${currentPage === pageNum ? "admin-btn--primary" : ""}`}
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
                &#8250;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
