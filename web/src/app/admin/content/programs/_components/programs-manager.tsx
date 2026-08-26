"use client";

import { useState } from "react";
import ProgramsTable from "./programs-table";
import ProgramsFormModal from "./programs-form-modal";
import ProgramsViewModal from "./programs-view-modal";
import { Program } from "@/types/programs";
import { Plus, RefreshCw } from "lucide-react";

const MOCK_PROGRAMS: Program[] = [
  {
    id: "prog-1",
    name: "Bachelor in Business Administration",
    slug: "bachelor-in-business-administration",
    code: "BBA",
    level: "Bachelor",
    duration: "4 Years",
    seats: 48,
    status: "open",
    image: "",
    intro:
      "The BBA program provides a comprehensive foundation in business management, covering core areas such as accounting, finance, marketing, human resources, and organizational behavior. Students develop practical skills through case studies, projects, and internships.",
    eligibility:
      "Students must have completed +2 or equivalent in any stream with a minimum GPA of 2.0. Admission is based on entrance examination and interview.",
    views: 1245,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "prog-2",
    name: "Bachelor in Business Administration – Finance",
    slug: "bachelor-in-business-administration-finance",
    code: "BBA-Finance",
    level: "Bachelor (Finance)",
    duration: "4 Years",
    seats: 48,
    status: "open",
    image: "",
    intro:
      "The BBA-Finance program specializes in financial management, banking, investment analysis, and corporate finance. Graduates are prepared for careers in banking, financial consulting, and corporate finance departments.",
    eligibility:
      "Students must have completed +2 or equivalent in any stream with a minimum GPA of 2.0. Strong aptitude in mathematics is preferred.",
    views: 987,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "prog-3",
    name: "Bachelor in Computer System & Information Technology",
    slug: "bachelor-in-computer-system-information-technology",
    code: "BCSIT",
    level: "Bachelor (IT)",
    duration: "4 Years",
    seats: 48,
    status: "open",
    image: "",
    intro:
      "The BCSIT program combines computer science fundamentals with information technology applications. Students learn programming, database management, networking, web technologies, and system analysis.",
    eligibility:
      "Students must have completed +2 or equivalent with Mathematics as a subject and a minimum GPA of 2.0. Basic computer literacy is recommended.",
    views: 1102,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
];

export default function ProgramsManager() {
  const [programs, setPrograms] = useState<Program[]>(MOCK_PROGRAMS);
  const [loading, setLoading] = useState(false);
  const [error] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingProgram, setViewingProgram] = useState<Program | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setPrograms([...MOCK_PROGRAMS]);
      setLoading(false);
    }, 600);
  };

  const handleViewProgram = (program: Program) => {
    setViewingProgram(program);
    setIsViewOpen(true);
  };

  const handleAddProgram = () => {
    setEditingProgram(null);
    setIsModalOpen(true);
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setIsModalOpen(true);
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveProgram = async (programData: Program) => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const isEdit = !!editingProgram;

    if (isEdit) {
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === editingProgram!.id
            ? { ...programData, id: p.id, updatedAt: new Date().toISOString() }
            : p
        )
      );
    } else {
      const newProgram: Program = {
        ...programData,
        id: `prog-${Date.now()}`,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPrograms((prev) => [newProgram, ...prev]);
    }

    setIsModalOpen(false);
    setEditingProgram(null);
    setSaving(false);
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Programs
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage academic programs, descriptions and eligibility.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="admin-btn"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleAddProgram}
          >
            <Plus size={16} />
            Add Program
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <ProgramsTable
              programs={programs}
              loading={loading}
              onView={handleViewProgram}
              onEdit={handleEditProgram}
              onDelete={handleDeleteProgram}
            />
          )}
        </div>
      </div>

      <ProgramsViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        program={viewingProgram}
      />

      <ProgramsFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        program={editingProgram}
        onSave={handleSaveProgram}
        saving={saving}
      />
    </main>
  );
}
