"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { LeadershipMessage } from "@/types/leadership-message";
import { Eye, Pencil, Trash2, Search, MessageSquare, UserRound } from "lucide-react";

interface LeadershipMessageTableProps {
  messages: LeadershipMessage[];
  onAdd: () => void;
  onView: (item: LeadershipMessage) => void;
  onEdit: (item: LeadershipMessage) => void;
  onDelete: (id: string) => void;
}

export default function LeadershipMessageTable({ messages, onAdd, onView, onEdit, onDelete }: LeadershipMessageTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const filtered = messages.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.author.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <div className="flex items-center gap-3 p-5 border-b border-[var(--admin-line)] flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none" />
          <Input type="text" placeholder="Search messages…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <div className="text-sm text-[var(--admin-muted)] ml-auto"><b>{filtered.length}</b> total</div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[52px] text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">PHOTO</TableHead>
              <TableHead className="w-1/2 text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">TITLE</TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">AUTHOR</TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">ROLE</TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-12"><div className="flex flex-col items-center"><MessageSquare size={40} className="opacity-30 mb-4" /><p>No records match your search.</p></div></TableCell></TableRow>
            ) : (
              paginated.map((item) => (
                <TableRow key={item.id} className="hover:bg-[#fafbfe] transition-colors">
                  <TableCell className="py-3">
                    {item.photo ? (
                      <img src={item.photo} alt={item.author} className="w-9 h-9 rounded-full object-cover border border-[var(--admin-line)]" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[var(--admin-surface-2)] border border-dashed border-[var(--admin-line)] flex items-center justify-center text-[var(--admin-muted)]">
                        <UserRound size={16} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="cell-main"><div className="font-semibold text-sm">{item.title}</div><small className="text-[var(--admin-muted)] text-[0.76rem]">{item.excerpt?.slice(0, 60)}{item.excerpt && item.excerpt.length > 60 ? "…" : ""}</small></div>
                  </TableCell>
                  <TableCell className="text-sm py-3">{item.author}</TableCell>
                  <TableCell className="text-sm py-3">{item.role || "—"}</TableCell>
                  <TableCell className="py-3">
                    <div className="row-actions justify-end">
                      <button type="button" className="act-btn" onClick={() => onView(item)} title="View"><Eye size={15} /></button>
                      <button type="button" className="act-btn" onClick={() => onEdit(item)} title="Edit"><Pencil size={15} /></button>
                      <button type="button" className="act-btn danger" onClick={() => onDelete(item.id)} title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {filtered.length > 0 && (
        <div className="flex items-center justify-between p-5 border-t border-[var(--admin-line)] flex-wrap gap-3">
          <div className="text-sm text-[var(--admin-muted)]">Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filtered.length)} of <b>{filtered.length}</b></div>
          <div className="flex gap-1">
            <button type="button" className="admin-btn admin-btn--sm min-w-[36px]" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>&lt;</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => { const p = i + 1; return (<button key={p} type="button" className={"admin-btn admin-btn--sm min-w-[36px] " + (currentPage === p ? "admin-btn--primary" : "")} onClick={() => setCurrentPage(p)}>{p}</button>); })}
            <button type="button" className="admin-btn admin-btn--sm min-w-[36px]" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>&gt;</button>
          </div>
        </div>
      )}
    </div>
  );
}
