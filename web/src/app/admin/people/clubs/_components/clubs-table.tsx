"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Club, CLUB_CATEGORIES } from "@/types/clubs";
import { Eye, Pencil, Trash2, Search, Users } from "lucide-react";

interface ClubsTableProps {
  clubs: Club[];
  onAdd: () => void;
  onView: (item: Club) => void;
  onEdit: (item: Club) => void;
  onDelete: (id: string) => void;
}

export default function ClubsTable({ clubs, onAdd, onView, onEdit, onDelete }: ClubsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const filtered = clubs.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <div className="flex items-center gap-3 p-5 border-b border-[var(--admin-line)] flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none" />
          <Input type="text" placeholder="Search clubs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value || "all")}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CLUB_CATEGORIES.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
          </SelectContent>
        </Select>
        <div className="text-sm text-[var(--admin-muted)] ml-auto"><b>{filtered.length}</b> total</div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3 text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">NAME</TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">CATEGORY</TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">COORDINATOR</TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">STATUS</TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors cursor-pointer">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <Users size={40} className="opacity-30 mb-4" />
                    <p>No clubs found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item) => (
                <TableRow key={item.id} className="hover:bg-[#fafbfe] transition-colors">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-[var(--admin-line)] flex-shrink-0 bg-[var(--admin-surface-2)]">
                        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" /> : <Users size={20} className="m-auto mt-2 opacity-30" />}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{item.name}</div>
                        <small className="text-[var(--admin-muted)] text-[0.76rem]">{item.memberCount} members</small>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm py-3"><span className="badge badge--blue">{item.category}</span></TableCell>
                  <TableCell className="text-sm py-3">{item.facultyCoordinator}</TableCell>
                  <TableCell className="text-sm py-3"><span className={`badge ${item.status === "active" ? "badge--green" : "badge--gray"}`}>{item.status}</span></TableCell>
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
          <div className="text-sm text-[var(--admin-muted)]">Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filtered.length)} of <b>{filtered.length}</b></div>
          <div className="flex gap-3 items-center">
            <Select value={itemsPerPage.toString()} onValueChange={(val) => { setItemsPerPage(Number(val)); setCurrentPage(1); }}>
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / page</SelectItem>
                <SelectItem value="8">8 / page</SelectItem>
                <SelectItem value="12">12 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <button type="button" className="admin-btn admin-btn--sm min-w-[36px]" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>&lt;</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => { const pageNum = i + 1; return (<button key={pageNum} type="button" className={"admin-btn admin-btn--sm min-w-[36px] " + (currentPage === pageNum ? "admin-btn--primary" : "")} onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>); })}
              <button type="button" className="admin-btn admin-btn--sm min-w-[36px]" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>&gt;</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
