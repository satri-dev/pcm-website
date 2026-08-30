/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { RoleDefinition, PermissionKey } from "../types";

const API_BASE = "/api/admin/system/users/roles";

export interface UseRolesReturn {
  roles: RoleDefinition[];
  loading: boolean;
  error: string;
  refresh: () => void;
  updatePermissions: (
    roleId: string,
    permissions: Record<PermissionKey, boolean>
  ) => Promise<void>;
}

export function useRoles(): UseRolesReturn {
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    fetch(API_BASE, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? "Your session has expired. Please sign in again."
              : `Failed to load roles (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setRoles(data.roles ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load roles");
        setLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [reloadKey.current]);

  const refresh = () => {
    reloadKey.current += 1;
    setLoading(true);
  };

  const updatePermissions = async (
    roleId: string,
    permissions: Record<PermissionKey, boolean>
  ): Promise<void> => {
    const res = await fetch(API_BASE, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [roleId]: permissions }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Update failed (HTTP ${res.status})`);
    }
    const data = await res.json();
    setRoles(data.roles ?? []);
  };

  return { roles, loading, error, refresh, updatePermissions };
}
