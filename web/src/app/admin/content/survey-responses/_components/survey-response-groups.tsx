"use client";

import { useState } from "react";
import { SurveyResponseGroup } from "@/types/survey-response";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Eye, Search, ClipboardList } from "lucide-react";

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

interface Props {
  groups: SurveyResponseGroup[];
  loading?: boolean;
  onView: (slug: string) => void;
}

export default function SurveyResponseGroups({ groups, loading = false, onView }: Props) {
  const [query, setQuery] = useState("");

  const filtered = groups.filter((g) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      g.surveyTitle.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.surveySlug.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex items-center gap-3 p-5 border-b border-[var(--admin-line)] flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by survey title or category…"
            className="pl-9"
            aria-label="Search surveys with responses"
          />
        </div>
        <div className="text-sm text-[var(--admin-muted)] ml-auto">
          <b>{filtered.length}</b> survey{filtered.length === 1 ? "" : "s"} with responses
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">SURVEY</TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">CATEGORY</TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">RESPONSES</TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">Q ANSWERED</TableHead>
              <TableHead className="text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">LAST RESPONSE</TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <p className="m-0 text-[var(--admin-muted)]">Loading survey responses…</p>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-14">
                  <div className="flex flex-col items-center">
                    <ClipboardList size={40} className="opacity-30 mb-4" />
                    <p className="m-0 text-[var(--admin-muted)]">
                      {groups.length === 0
                        ? "No survey responses yet. Responses submitted on the public site will appear here."
                        : "No surveys match your search."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((g) => (
                <TableRow key={g.surveySlug} className="hover:bg-[#fafbfe] transition-colors">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{g.icon}</span>
                      <div className="cell-main">
                        <div className="font-semibold text-sm text-[var(--admin-ink)]">{g.surveyTitle}</div>
                        <small className="text-[var(--admin-muted)] text-[0.76rem]">/{g.surveySlug}</small>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    {g.category ? <span className="badge badge--blue">{g.category}</span> : <span className="badge badge--gray">—</span>}
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="badge badge--green">{g.count}</span>
                  </TableCell>
                  <TableCell className="text-sm py-3 text-[var(--admin-muted)]">{g.answeredQuestions}</TableCell>
                  <TableCell className="text-sm py-3 text-[var(--admin-muted)]">{formatDate(g.lastResponseAt)}</TableCell>
                  <TableCell className="py-3">
                    <div className="row-actions justify-end">
                      <button type="button" className="act-btn" onClick={() => onView(g.surveySlug)} title="View responses">
                        <Eye size={15} /> <span className="text-[0.8rem]">View</span>
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
