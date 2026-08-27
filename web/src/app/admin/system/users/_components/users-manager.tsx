"use client";

import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { useRoles } from "../hooks/useRoles";
import { UserEntry } from "../types";
import UsersTable from "./users-table";
import RolesPermissionsTable from "./roles-permissions-table";
import AddUserModal from "./add-user-modal";
import EditUserModal from "./edit-user-modal";
import { Plus, RefreshCw, Users, Shield } from "lucide-react";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";
import { HardDeleteDialog } from "@/components/shared/HardDeleteDialog";

interface UsersManagerProps {
  initialData?: UserEntry[];
  currentUserId?: string;
}

type TabId = "accounts" | "roles";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "accounts", label: "Accounts", icon: <Users size={16} /> },
  { id: "roles", label: "Roles & Permissions", icon: <Shield size={16} /> },
];

export default function UsersManager({
  initialData,
  currentUserId,
}: UsersManagerProps) {
  const {
    users,
    loading,
    error,
    refresh,
    createUser,
    updateUser,
    banUser,
    unbanUser,
    deleteUser,
  } = useUsers({ initialData });

  const {
    roles,
    loading: rolesLoading,
    updatePermissions,
  } = useRoles();

  const [activeTab, setActiveTab] = useState<TabId>("accounts");

  // Add modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserEntry | null>(null);

  // Soft delete dialog
  const [softDeleteOpen, setSoftDeleteOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserEntry | null>(null);

  // Hard delete dialog
  const [hardDeleteOpen, setHardDeleteOpen] = useState(false);
  const [hardDeletingUser, setHardDeletingUser] = useState<UserEntry | null>(
    null
  );

  // Toast-like feedback (simple state for now)
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handlers
  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  const handleEditUser = (user: UserEntry) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleSoftDelete = (user: UserEntry) => {
    setDeletingUser(user);
    setSoftDeleteOpen(true);
  };

  const handleBan = async (user: UserEntry) => {
    try {
      await banUser(user.id);
      showToast(`@${user.username} has been banned`);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to ban user",
        "error"
      );
    }
  };

  const handleUnban = async (user: UserEntry) => {
    try {
      await unbanUser(user.id);
      showToast(`@${user.username} has been unbanned`);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to unban user",
        "error"
      );
    }
  };

  const handleHardDeleteClick = (user: UserEntry) => {
    setHardDeletingUser(user);
    setHardDeleteOpen(true);
  };

  const handleConfirmSoftDelete = async () => {
    if (!deletingUser) return;
    try {
      await banUser(deletingUser.id);
      showToast(`@${deletingUser.username} moved to trash`);
      setSoftDeleteOpen(false);
      setDeletingUser(null);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to ban user",
        "error"
      );
    }
  };

  const handleConfirmHardDelete = async () => {
    if (!hardDeletingUser) return;
    try {
      await deleteUser(hardDeletingUser.id);
      showToast(`@${hardDeletingUser.username} permanently deleted`);
      setHardDeleteOpen(false);
      setHardDeletingUser(null);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to delete user",
        "error"
      );
    }
  };

  const handleSaveAddUser = async (data: {
    name: string;
    email: string;
    username: string;
    password: string;
    role: string;
  }) => {
    setSaving(true);
    try {
      await createUser(data);
      setIsAddModalOpen(false);
      showToast(`User @${data.username} created`);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to create user",
        "error"
      );
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEditUser = async (
    id: string,
    data: {
      name: string;
      email: string;
      username: string;
      role: string;
      password?: string;
    }
  ) => {
    setSaving(true);
    try {
      await updateUser(id, data);
      setIsEditModalOpen(false);
      setEditingUser(null);
      showToast("User updated");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to update user",
        "error"
      );
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white transition-all ${
            toast.type === "success"
              ? "bg-[var(--admin-green)]"
              : "bg-[var(--admin-red)]"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)] flex items-center gap-2">
            <Users size={24} /> Users & Roles
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage admin accounts and their permissions.
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
            onClick={handleAddUser}
          >
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-4 border-b border-[var(--admin-line)]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? "border-[var(--admin-brand)] text-[var(--admin-brand)]"
                : "border-transparent text-[var(--admin-muted)] hover:text-[var(--admin-ink)]"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : activeTab === "accounts" ? (
            <UsersTable
              users={users}
              loading={loading}
              currentUserId={currentUserId}
              onEdit={handleEditUser}
              onSoftDelete={handleSoftDelete}
              onHardDelete={handleHardDeleteClick}
              onBan={handleBan}
              onUnban={handleUnban}
            />
          ) : (
            <RolesPermissionsTable
              roles={roles}
              loading={rolesLoading}
              onUpdate={updatePermissions}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleSaveAddUser}
        saving={saving}
      />

      <EditUserModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        entry={editingUser}
        onSave={handleSaveEditUser}
        saving={saving}
      />

      <SoftDeleteDialog
        open={softDeleteOpen}
        onOpenChange={setSoftDeleteOpen}
        onConfirm={handleConfirmSoftDelete}
        itemName={deletingUser ? `@${deletingUser.username}` : undefined}
        itemType="user"
        description={
          deletingUser
            ? `Are you sure you want to ban @${deletingUser.username}? They will not be able to sign in.`
            : undefined
        }
      />

      <HardDeleteDialog
        open={hardDeleteOpen}
        onOpenChange={setHardDeleteOpen}
        onConfirm={handleConfirmHardDelete}
        itemName={
          hardDeletingUser ? `@${hardDeletingUser.username}` : undefined
        }
        itemType="user"
        warningMessage="This will permanently delete the user, their account records, and all active sessions. This action cannot be undone."
        description={
          hardDeletingUser
            ? `Are you sure you want to permanently delete @${hardDeletingUser.username}? This action cannot be undone.`
            : undefined
        }
      />
    </main>
  );
}
