"use client";

import { useState } from "react";
import { useChatbot } from "../hooks/useChatbot";
import ChatbotTable from "./chatbot-table";
import ChatbotFormModal from "./chatbot-form-modal";
import ChatbotViewModal from "./chatbot-view-modal";
import { ChatbotEntry } from "../types/chatbot";
import { Plus, RefreshCw, Bot } from "lucide-react";

interface ChatbotManagerProps {
  initialData?: ChatbotEntry[];
}

export default function ChatbotManager({ initialData }: ChatbotManagerProps) {
  const {
    entries,
    loading,
    error,
    refresh,
    createEntry,
    updateEntry,
    deleteEntry,
  } = useChatbot({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ChatbotEntry | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingEntry, setViewingEntry] = useState<ChatbotEntry | null>(null);
  const [saving, setSaving] = useState(false);

  const handleViewEntry = (entry: ChatbotEntry) => {
    setViewingEntry(entry);
    setIsViewOpen(true);
  };

  const handleAddEntry = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleEditEntry = (entry: ChatbotEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this chatbot entry?")) return;
    try {
      await deleteEntry(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveEntry = async (data: ChatbotEntry) => {
    setSaving(true);
    try {
      if (data.id && entries.some((e) => e.id === data.id)) {
        await updateEntry(data.id, data);
      } else {
        await createEntry(data);
      }
      setIsModalOpen(false);
      setEditingEntry(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)] flex items-center gap-2">
            <Bot size={24} /> Chatbot Knowledge Base
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage chatbot responses, keywords, and channel configurations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="admin-btn"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleAddEntry}
          >
            <Plus size={16} /> Add Entry
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <ChatbotTable
              entries={entries}
              loading={loading}
              onView={handleViewEntry}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          )}
        </div>
      </div>

      <ChatbotViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        entry={viewingEntry}
      />

      <ChatbotFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        entry={editingEntry}
        onSave={handleSaveEntry}
        saving={saving}
      />
    </main>
  );
}
