"use client";

import { LeadershipMessage } from "@/types/leadership-message";
import { useLeadershipMessage } from "../hooks/use-leadership-message";
import LeadershipMessageTable from "./leadership-message-table";
import LeadershipMessageFormModal from "./leadership-message-form-modal";
import LeadershipMessageViewModal from "./leadership-message-view-modal";
import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

interface LeadershipMessageManagerProps { initialData?: LeadershipMessage[]; }

export default function LeadershipMessageManager({ initialData }: LeadershipMessageManagerProps) {
  const { messages, loading, error, refresh, createMessage, updateMessage, deleteMessage } = useLeadershipMessage({ initialData });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LeadershipMessage | null>(null);
  const [saving, setSaving] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<LeadershipMessage | null>(null);

  const handleAdd = () => { setEditingItem(null); setIsModalOpen(true); };
  const handleView = (item: LeadershipMessage) => { setViewingItem(item); setIsViewOpen(true); };
  const handleEdit = (item: LeadershipMessage) => { setEditingItem(item); setIsModalOpen(true); };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try { await deleteMessage(id); } catch (err) { alert(err instanceof Error ? err.message : "Delete failed"); }
  };
  const handleSave = async (data: LeadershipMessage) => {
    setSaving(true);
    try {
      if (data.id && messages.some((m) => m.id === data.id)) { await updateMessage(data.id, data); } else { await createMessage(data); }
      setIsModalOpen(false); setEditingItem(null);
    } catch (err) { alert(err instanceof Error ? err.message : "Save failed"); } finally { setSaving(false); }
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">Leadership Messages</h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">Manage, search and edit leadership messages.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="admin-btn" onClick={refresh} disabled={loading}><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button>
          <button type="button" className="admin-btn admin-btn--primary" onClick={handleAdd}><Plus size={16} /> Add Message</button>
        </div>
      </div>
      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? <div className="p-6 text-[var(--admin-red)]">{error}</div> : <LeadershipMessageTable messages={messages} onAdd={handleAdd} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />}
        </div>
      </div>
      <LeadershipMessageFormModal open={isModalOpen} onOpenChange={setIsModalOpen} message={editingItem} onSave={handleSave} saving={saving} />
      <LeadershipMessageViewModal open={isViewOpen} onOpenChange={setIsViewOpen} message={viewingItem} />
    </main>
  );
}
