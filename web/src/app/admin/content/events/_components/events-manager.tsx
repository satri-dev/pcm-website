"use client";

import { useState } from "react";
import { useEvents } from "../hooks/use-events";
import EventsTable from "./events-table";
import EventsFormModal from "./events-form-modal";
import EventsViewModal from "./events-view-modal";
import { Event } from "@/types/events";
import { Plus, RefreshCw } from "lucide-react";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";

interface EventsManagerProps {
  initialData?: Event[];
}

export default function EventsManager({ initialData }: EventsManagerProps) {
  const {
    events,
    loading,
    error,
    refresh,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEvents({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingItemName, setDeletingItemName] = useState<string>("");

  const handleViewEvent = (event: Event) => {
    setViewingEvent(event);
    setIsViewOpen(true);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (event: Event) => {
    setDeletingItemId(event.id);
    setDeletingItemName(event.title || "this item");
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItemId) return;
    try {
      await deleteEvent(deletingItemId);
      setDeleteDialogOpen(false);
      setDeletingItemId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveEvent = async (eventData: Event) => {
    setSaving(true);
    try {
      if (eventData.id && events.some((e) => e.id === eventData.id)) {
        await updateEvent(eventData.id, eventData);
      } else {
        await createEvent(eventData);
      }
      setIsModalOpen(false);
      setEditingEvent(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6">
      {/* Header outside the panel */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Events & Workshops
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage, search and edit events and workshops.
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
            onClick={handleAddEvent}
          >
            <Plus size={16} />
            Add Event
          </button>
        </div>
      </div>

      {/* Table panel */}
      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <EventsTable
              events={events}
              loading={loading}
              onView={handleViewEvent}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          )}
        </div>
      </div>

      <EventsViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        event={viewingEvent}
      />

      <EventsFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        event={editingEvent}
        onSave={handleSaveEvent}
        saving={saving}
      />

      <SoftDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={deletingItemName}
        itemType="event"
        loading={false}
      />
    </main>
  );
}
