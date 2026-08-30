"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Bod } from "@/types/bod";
import { Eye, Pencil, Trash2, Search, Shield } from "lucide-react";

interface BodTableProps {
  bod: Bod[];
  onAdd: () => void;
  onView: (item: Bod) => void;
  onEdit: (item: Bod) => void;
  onDelete: (id: string) => void;
}

export default function BodTable({ bod, onAdd, onView, onEdit, onDelete }: BodTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const filtered = bod.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.role.toLowerCase().includes(searchQuery.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => (a.order || 0) - (b.order || 0));
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = sorted.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <div className="flex items-center gap-3 p-5 border-b border-[var(--admin-line)] flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none" />
          <Input type="text" placeholder="Search board members…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <div className="text-sm text-[var(--admin-muted)] ml-auto"><b>{filtered.length}</b> total</div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2 text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">NAME</TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">ROLE</TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">ORDER</TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12"><div className="flex flex-col items-center"><Shield size={40} className="opacity-30 mb-4" /><p>No records match your search.</p></div></TableCell></TableRow>
            ) : (
              paginated.map((item) => (
                <TableRow key={item.id} className="hover:bg-[#fafbfe] transition-colors">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--admin-line)] flex-shrink-0 bg-[var(--admin-surface-2)]">
                        {item.photo ? <img src={item.photo} alt={item.name} className="w-full h-full object-cover" loading="lazy" /> : <Shield size={20} className="m-auto mt-2 opacity-30" />}
                      </div>
                      <div className="cell-main"><div className="font-semibold text-sm">{item.name}</div></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm py-3">{item.role}</TableCell>
                  <TableCell className="text-sm py-3">{item.order ?? "—"}</TableCell>
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
      {sorted.length > 0 && (
        <div className="flex items-center justify-between p-5 border-t border-[var(--admin-line)] flex-wrap gap-3">
          <div className="text-sm text-[var(--admin-muted)]">Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, sorted.length)} of <b>{sorted.length}</b></div>
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
