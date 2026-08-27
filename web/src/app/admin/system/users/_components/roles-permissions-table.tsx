"use client";

import { useState } from "react";
import { RoleDefinition, PermissionKey, PERMISSION_LIST } from "../types";
import { Save, RefreshCw } from "lucide-react";

interface RolesPermissionsTableProps {
  roles: RoleDefinition[];
  loading?: boolean;
  onUpdate: (
    roleId: string,
    permissions: Record<PermissionKey, boolean>
  ) => Promise<void>;
}

export default function RolesPermissionsTable({
  roles,
  loading = false,
  onUpdate,
}: RolesPermissionsTableProps) {
  const [saving, setSaving] = useState<string | null>(null);
  const [localRoles, setLocalRoles] = useState<RoleDefinition[]>(roles);

  // Sync with parent roles when they change
  if (JSON.stringify(roles) !== JSON.stringify(localRoles)) {
    setLocalRoles(roles);
  }

  const handleToggle = async (
    roleId: string,
    permKey: PermissionKey,
    currentValue: boolean
  ) => {
    // Prevent removing manageUsers from admin
    if (roleId === "admin" && permKey === "manageUsers" && currentValue) {
      return;
    }

    const newPerms = {
      ...localRoles.find((r) => r.id === roleId)?.permissions,
      [permKey]: !currentValue,
    } as Record<PermissionKey, boolean>;

    // Optimistic update
    setLocalRoles((prev) =>
      prev.map((r) =>
        r.id === roleId ? { ...r, permissions: newPerms } : r
      )
    );

    try {
      setSaving(roleId);
      await onUpdate(roleId, newPerms);
    } catch {
      // Revert on error
      setLocalRoles(roles);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <RefreshCw size={32} className="opacity-40 mb-4 animate-spin mx-auto" />
        <p className="text-[var(--admin-muted)]">Loading roles...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="perm-table">
          <thead>
            <tr>
              <th className="text-left">Permission</th>
              {localRoles.map((role) => (
                <th key={role.id} className="text-center">
                  {role.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSION_LIST.map((perm) => (
              <tr key={perm.key}>
                <td>
                  <div>
                    <span className="font-semibold text-sm">{perm.label}</span>
                    {perm.key === "manageUsers" && (
                      <span className="text-xs text-[var(--admin-muted)] ml-1">
                        (Admin only)
                      </span>
                    )}
                  </div>
                </td>
                {localRoles.map((role) => {
                  const isChecked = role.permissions[perm.key] ?? false;
                  const isDisabled =
                    role.id === "admin" && perm.key === "manageUsers";
                  const isSavingThis = saving === role.id;

                  return (
                    <td key={role.id}>
                      <div className="flex justify-center">
                        <label
                          className={`switch switch--sm ${isDisabled ? "opacity-60 pointer-events-none" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isDisabled || isSavingThis}
                            onChange={() =>
                              handleToggle(role.id, perm.key, isChecked)
                            }
                          />
                          <span className="track" />
                        </label>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-[var(--admin-line)]">
        <p className="text-xs text-[var(--admin-muted)] m-0">
          Changes to permissions take effect immediately. The admin role always
          retains user management access.
        </p>
      </div>
    </div>
  );
}
