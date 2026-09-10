"use client";

import { useEffect, useState } from "react";
import { HardDeleteDialog } from "@/components/shared/HardDeleteDialog";
import { Trash2, RotateCcw, X } from "lucide-react";

interface TrashedItem {
  id: string;
  name: string;
  collection: string;
  deletedAt: string;
}

interface BulkProgress {
  total: number;
  completed: number;
  deleting: boolean;
}

const COLLECTION_LABELS: Record<string, string> = {
  blogs: "Blogs",
  gallery: "Gallery",
  downloads: "Downloads",
};

export default function MediaTrashPage() {
  const [items, setItems] = useState<TrashedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hardDeleteDialogOpen, setHardDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TrashedItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<BulkProgress>({
    total: 0,
    completed: 0,
    deleting: false,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/media/trash");
        if (!res.ok) throw new Error("Failed to load trash");
        const data = await res.json();
        if (!cancelled) setItems(data.items ?? []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load trash");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const getCollectionPath = (collection: string) => {
    return `media/${collection}`;
  };

  const handleRestore = async (item: TrashedItem) => {
    try {
      const res = await fetch(
        `/api/admin/${getCollectionPath(item.collection)}/${item.id}?action=restore`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error("Failed to restore");
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Restore failed");
    }
  };

  const handlePermanentDelete = async () => {
    if (!selectedItem) return;
    try {
      const res = await fetch(
        `/api/admin/${getCollectionPath(selectedItem.collection)}/${selectedItem.id}?action=permanent-delete`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      setItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(selectedItem.id);
        return next;
      });
      setHardDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setBulkDialogOpen(true);
  };

  const handleConfirmBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    const total = ids.length;
    if (total === 0) return;

    setBulkDialogOpen(false);
    setBulkProgress({ total, completed: 0, deleting: true });

    for (let i = 0; i < ids.length; i++) {
      const item = items.find((it) => it.id === ids[i]);
      if (item) {
        try {
          await fetch(
            `/api/admin/${getCollectionPath(item.collection)}/${item.id}?action=permanent-delete`,
            { method: "PATCH" }
          );
        } catch {
          // Continue with remaining items
        }
      }
      setBulkProgress((prev) => ({ ...prev, completed: i + 1 }));
    }

    setItems((prev) => prev.filter((i) => !selectedIds.has(i.id)));
    setBulkProgress({ total: 0, completed: 0, deleting: false });
    setSelectedIds(new Set());
  };

  const handleEmptyTrash = async () => {
    if (items.length === 0) return;
    setBulkProgress({ total: items.length, completed: 0, deleting: true });

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      try {
        await fetch(
          `/api/admin/${getCollectionPath(item.collection)}/${item.id}?action=permanent-delete`,
          { method: "PATCH" }
        );
      } catch {
        // Continue with remaining items
      }
      setBulkProgress((prev) => ({ ...prev, completed: i + 1 }));
    }

    setItems([]);
    setBulkProgress({ total: 0, completed: 0, deleting: false });
    setSelectedIds(new Set());
  };

  const allSelected = items.length > 0 && items.every((i) => selectedIds.has(i.id));
  const someSelected = items.some((i) => selectedIds.has(i.id));

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedCount = selectedIds.size;
  const bulkProgressPercent =
    bulkProgress.total > 0
      ? Math.round((bulkProgress.completed / bulkProgress.total) * 100)
      : 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Media Trash</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Trashed items from Blogs, Gallery, and Downloads
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && !bulkProgress.deleting && (
            <button
              onClick={handleBulkDelete}
              className="admin-btn bg-red-600 hover:bg-red-700 text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Delete Selected ({selectedCount})
            </button>
          )}
          {items.length > 0 && !bulkProgress.deleting && (
            <button
              onClick={handleEmptyTrash}
              className="admin-btn bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Empty Trash
            </button>
          )}
        </div>
      </div>

      {/* Bulk delete progress bar */}
      {bulkProgress.deleting && (
        <div className="mb-4 rounded-lg border border-[var(--admin-line)] bg-[var(--admin-surface)] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--admin-ink)]">
              Permanently deleting items...
            </span>
            <span className="text-sm text-[var(--admin-muted)]">
              {bulkProgress.completed} of {bulkProgress.total} items
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--admin-surface-2)] overflow-hidden">
            <div
              className="h-full rounded-full bg-red-600 transition-all duration-300 ease-out"
              style={{ width: `${bulkProgressPercent}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <Trash2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Trash is empty</p>
        </div>
      ) : (
        <div className="admin-panel">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="w-[50px] py-3 px-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected && !allSelected;
                    }}
                    onChange={handleSelectAll}
                    disabled={bulkProgress.deleting}
                    className="h-4 w-4 rounded border-[var(--admin-line)] accent-red-600 cursor-pointer"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Type</th>
                <th className="text-left py-3 px-4 font-medium">Deleted</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-3 px-4 w-[50px]">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => handleToggleRow(item.id)}
                      disabled={bulkProgress.deleting}
                      className="h-4 w-4 rounded border-[var(--admin-line)] accent-red-600 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-4">{item.name}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {COLLECTION_LABELS[item.collection] ?? item.collection}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {item.deletedAt
                      ? new Date(item.deletedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRestore(item)}
                      className="admin-btn mr-2"
                      title="Restore"
                      disabled={bulkProgress.deleting}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setHardDeleteDialogOpen(true);
                      }}
                      className="admin-btn text-red-600 hover:bg-red-50"
                      title="Delete Permanently"
                      disabled={bulkProgress.deleting}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <HardDeleteDialog
        open={hardDeleteDialogOpen}
        onOpenChange={setHardDeleteDialogOpen}
        onConfirm={handlePermanentDelete}
        itemName={selectedItem?.name}
        itemType={COLLECTION_LABELS[selectedItem?.collection ?? ""] ?? "item"}
      />

      <HardDeleteDialog
        open={bulkDialogOpen}
        onOpenChange={setBulkDialogOpen}
        onConfirm={handleConfirmBulkDelete}
        title={`Permanently Delete ${selectedCount} Item${selectedCount === 1 ? "" : "s"}?`}
        description={`Are you sure you want to permanently delete ${selectedCount} item${selectedCount === 1 ? "" : "s"}? This action cannot be undone.`}
        confirmText={`Delete ${selectedCount} Item${selectedCount === 1 ? "" : "s"} Permanently`}
        warningMessage="All selected items will be permanently removed. This action cannot be undone."
      />
    </div>
  );
}
