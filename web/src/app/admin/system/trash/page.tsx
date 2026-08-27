"use client";

import { useEffect, useState } from "react";
import { HardDeleteDialog } from "@/components/shared/HardDeleteDialog";
import { Trash2, RotateCcw, X, Users, Bot } from "lucide-react";

interface TrashedItem {
  id: string;
  name: string;
  collection: string;
  deletedAt: string;
  type: "chatbot" | "user";
}

export default function SystemTrashPage() {
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
      const res = await fetch("/api/admin/system/trash");
      if (!res.ok) throw new Error("Failed to load trash");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trash");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (item: TrashedItem) => {
    try {
      let res: Response;
      if (item.type === "user") {
        // Restore user = unban them
        res = await fetch(
          `/api/admin/system/users/${item.id}?action=unban`,
          { method: "PATCH" }
        );
      } else {
        // Restore chatbot entry
        res = await fetch(
          `/api/admin/chatbot/${item.id}?action=restore`,
          { method: "PATCH" }
        );
      }
      if (!res.ok) throw new Error("Failed to restore");
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Restore failed");
    }
  };

  const handlePermanentDelete = async () => {
    if (!selectedItem) return;
    try {
      let res: Response;
      if (selectedItem.type === "user") {
        // Hard delete user
        res = await fetch(
          `/api/admin/system/users/${selectedItem.id}`,
          { method: "DELETE" }
        );
      } else {
        // Permanent delete chatbot entry
        res = await fetch(
          `/api/admin/chatbot/${selectedItem.id}?action=permanent-delete`,
          { method: "PATCH" }
        );
      }
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
      try {
        if (item.type === "user") {
          await fetch(`/api/admin/system/users/${item.id}`, {
            method: "DELETE",
          });
        } else {
          await fetch(
            `/api/admin/chatbot/${item.id}?action=permanent-delete`,
            { method: "PATCH" }
          );
        }
      } catch {
        // Continue with next item
      }
    }
    setItems([]);
  };

  const typeIcon = (type: string) => {
    return type === "user" ? (
      <Users size={14} className="inline mr-1" />
    ) : (
      <Bot size={14} className="inline mr-1" />
    );
  };

  const typeBadge = (type: string) => {
    return type === "user" ? "badge--blue" : "badge--violet";
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">System Trash</h1>
          <p className="text-[var(--admin-muted)] text-sm mt-1">
            Trashed items from Chatbot Entries and Banned Users
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="admin-btn admin-btn--primary"
            style={{ background: "var(--admin-red)", borderColor: "var(--admin-red)" }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Empty Trash
          </button>
        )}
      </div>

      {error && (
        <div
          className="px-4 py-3 rounded mb-4 text-sm"
          style={{
            background: "#fdeaea",
            border: "1px solid #f5c6c6",
            color: "var(--admin-red)",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-[var(--admin-muted)]">
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="admin-panel">
          <div className="text-center py-12">
            <Trash2
              size={48}
              className="mx-auto mb-4"
              style={{ opacity: 0.3 }}
            />
            <p className="text-[var(--admin-muted)]">Trash is empty</p>
          </div>
        </div>
      ) : (
        <div className="admin-panel">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--admin-line)]">
                <th
                  className="text-left py-3 px-4 font-medium text-[0.72rem] uppercase tracking-wider"
                  style={{ color: "var(--admin-muted)" }}
                >
                  Item
                </th>
                <th
                  className="text-left py-3 px-4 font-medium text-[0.72rem] uppercase tracking-wider"
                  style={{ color: "var(--admin-muted)" }}
                >
                  Type
                </th>
                <th
                  className="text-left py-3 px-4 font-medium text-[0.72rem] uppercase tracking-wider"
                  style={{ color: "var(--admin-muted)" }}
                >
                  Deleted
                </th>
                <th
                  className="text-right py-3 px-4 font-medium text-[0.72rem] uppercase tracking-wider"
                  style={{ color: "var(--admin-muted)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={`${item.type}-${item.id}`}
                  className="border-b border-[var(--admin-line)] last:border-0 hover:bg-[#fafbfe]"
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-sm">{item.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${typeBadge(item.type)}`}>
                      {typeIcon(item.type)}
                      {item.type === "user" ? "User" : "Chatbot"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm" style={{ color: "var(--admin-muted)" }}>
                    {item.deletedAt
                      ? new Date(item.deletedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="row-actions justify-end">
                      <button
                        onClick={() => handleRestore(item)}
                        className="act-btn"
                        title={
                          item.type === "user"
                            ? "Unban user"
                            : "Restore"
                        }
                      >
                        <RotateCcw size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setHardDeleteDialogOpen(true);
                        }}
                        className="act-btn danger"
                        title="Delete Permanently"
                      >
                        <X size={15} />
                      </button>
                    </div>
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
        itemType={selectedItem?.type === "user" ? "user" : "chatbot entry"}
        warningMessage={
          selectedItem?.type === "user"
            ? "This will permanently delete the user, their account records, and all active sessions."
            : undefined
        }
      />
    </div>
  );
}
