"use client";

import { useState, useCallback } from "react";
import {
  HardDrive,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileJson,
} from "lucide-react";
import type { BackupEntry } from "@/core/lib/backup-utils";

interface BackupsManagerProps {
  initialBackups: BackupEntry[];
}

export default function BackupsManager({ initialBackups }: BackupsManagerProps) {
  const [backups, setBackups] = useState<BackupEntry[]>(initialBackups);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchBackups = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/system/backup");
      if (!res.ok) throw new Error("Failed to load backups");
      const data = await res.json();
      setBackups(data.backups ?? []);
    } catch {
      setMessage({ type: "error", text: "Failed to refresh backup list" });
    }
  }, []);

  const handleCreateBackup = async () => {
    setCreating(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/system/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "backup" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Backup failed");
      setMessage({ type: "success", text: data.message });
      await fetchBackups();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Backup failed",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = async (timestamp: string) => {
    setDownloading(timestamp);
    try {
      const res = await fetch(`/api/admin/system/backup/${timestamp}`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pcm-backup-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Download failed",
      });
    } finally {
      setDownloading(null);
    }
  };

  const handleRestore = async (timestamp: string) => {
    if (
      !confirm(
        `Restore from backup ${timestamp}?\n\nThis will OVERWRITE all current data (except sessions).`
      )
    )
      return;

    setRestoring(timestamp);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/system/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", timestamp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Restore failed");
      setMessage({ type: "success", text: data.message });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Restore failed",
      });
    } finally {
      setRestoring(null);
    }
  };

  const handleDelete = async (timestamp: string) => {
    if (!confirm(`Delete backup ${timestamp}?`)) return;

    setDeleting(timestamp);
    setMessage(null);
    try {
      const res = await fetch(
        `/api/admin/system/backup?timestamp=${timestamp}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setMessage({ type: "success", text: data.message });
      await fetchBackups();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Delete failed",
      });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Database Backups</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Export your database as JSON — no external tools required
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchBackups}
            className="admin-btn"
            title="Refresh list"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className="admin-btn admin-btn--primary"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {creating ? "Exporting..." : "Export Backup"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded mb-4 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
          )}
          {message.text}
        </div>
      )}

      <div className="admin-stats mb-6">
        <div className="admin-stat admin-stat--brand">
          <div className="admin-stat__label">
            <HardDrive /> Total Backups
          </div>
          <div className="admin-stat__value">{backups.length}</div>
          <div className="admin-stat__sub">
            {backups.length === 1 ? "backup stored" : "backups stored"}
          </div>
        </div>
        <div className="admin-stat admin-stat--green">
          <div className="admin-stat__label">
            <CheckCircle /> Latest Backup
          </div>
          <div className="admin-stat__value">
            {backups.length > 0 ? backups[0].size : "—"}
          </div>
          <div className="admin-stat__sub">
            {backups.length > 0 ? backups[0].createdAt : "No backups yet"}
          </div>
        </div>
        <div className="admin-stat admin-stat--gold">
          <div className="admin-stat__label">
            <FileJson /> Collections
          </div>
          <div className="admin-stat__value">
            {backups.length > 0 ? backups[0].collections : "—"}
          </div>
          <div className="admin-stat__sub">
            {backups.length > 0
              ? `${backups[0].collections} collections exported`
              : "Nothing exported yet"}
          </div>
        </div>
        <div className="admin-stat admin-stat--blue">
          <div className="admin-stat__label">
            <RefreshCw /> Auto Cleanup
          </div>
          <div className="admin-stat__value">7</div>
          <div className="admin-stat__sub">keeps last 7 backups</div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__head">
          <div>
            <h3>Backup History</h3>
            <p>All database exports sorted by most recent</p>
          </div>
        </div>
        <div className="admin-panel__body">
          {backups.length === 0 ? (
            <div className="text-center py-12">
              <HardDrive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No backups yet</p>
              <p className="text-sm text-muted-foreground">
                Click &quot;Export Backup&quot; to save your first database
                snapshot.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Backup</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Collections
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Size</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((backup, idx) => (
                  <tr
                    key={backup.timestamp}
                    className="border-b last:border-0"
                  >
                    <td className="py-3 px-4">
                      <div className="cell-main">
                        <b>{backup.createdAt}</b>
                        <small className="font-mono text-xs">
                          {backup.timestamp}
                        </small>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="admin-badge admin-badge--blue">
                        {backup.collections} collections
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{backup.size}</td>
                    <td className="py-3 px-4">
                      <div className="row-actions justify-end">
                        {idx === 0 && (
                          <span
                            className="admin-badge admin-badge--green mr-2"
                            title="Latest backup"
                          >
                            Latest
                          </span>
                        )}
                        <button
                          onClick={() => handleDownload(backup.timestamp)}
                          disabled={downloading === backup.timestamp}
                          className="act-btn"
                          title="Download JSON file"
                        >
                          {downloading === backup.timestamp ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Download />
                          )}
                        </button>
                        <button
                          onClick={() => handleRestore(backup.timestamp)}
                          disabled={restoring === backup.timestamp}
                          className="act-btn gold"
                          title="Restore this backup"
                        >
                          {restoring === backup.timestamp ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Upload />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(backup.timestamp)}
                          disabled={deleting === backup.timestamp}
                          className="act-btn danger"
                          title="Delete backup"
                        >
                          {deleting === backup.timestamp ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Trash2 />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
