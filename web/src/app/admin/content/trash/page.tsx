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

const COLLECTION_LABELS: Record<string, string> = {
  news: "News",
  notices: "Notices",
  results: "Results",
  events: "Events",
  programs: "Programs",
  scholarships: "Scholarships",
  faqs: "FAQs",
  surveys: "Surveys",
};

export default function ContentTrashPage() {
  const [items, setItems] = useState<TrashedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hardDeleteDialogOpen, setHardDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TrashedItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content/trash");
      if (!res.ok) throw new Error("Failed to load trash");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trash");
    } finally {
      setLoading(false);
    }
  };

  const getCollectionPath = (collection: string) => {
    return `content/${collection}`;
  };

  const handleRestore = async (item: TrashedItem) => {
    try {
      const res = await fetch(
        `/api/admin/${getCollectionPath(item.collection)}/${item.id}?action=restore`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error("Failed to restore");
      setItems((prev) => prev.filter((i) => i.id !== item.id));
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
      setHardDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleEmptyTrash = async () => {
    if (!confirm("Are you sure you want to empty the entire trash? This cannot be undone.")) return;
    for (const item of items) {
      await fetch(
        `/api/admin/${getCollectionPath(item.collection)}/${item.id}?action=permanent-delete`,
        { method: "PATCH" }
      );
    }
    setItems([]);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Content Trash</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Trashed items from News, Notices, Results, Events, Programs, Scholarships, FAQs, and Surveys
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="admin-btn bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Empty Trash
          </button>
        )}
      </div>

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
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Type</th>
                <th className="text-left py-3 px-4 font-medium">Deleted</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
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
    </div>
  );
}
