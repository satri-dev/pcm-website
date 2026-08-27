import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/core/lib/api-guard";
import { getDb } from "@/core/lib/db";
import {
  ROLE_COLLECTION,
  roleFromDocument,
  PERMISSION_KEYS,
  type RoleDocument,
  type PermissionKey,
} from "@/app/admin/system/users/types";
import { z } from "zod";

const DEFAULT_ROLES: Omit<RoleDocument, "_id" | "createdAt" | "updatedAt">[] = [
  {
    id: "admin",
    label: "Admin",
    description: "Full access to all features",
    permissions: {
      manageUsers: true,
      manageContent: true,
      manageSettings: true,
      manageBackup: true,
    },
  },
  {
    id: "editor",
    label: "Editor",
    description: "Can edit and publish content",
    permissions: {
      manageUsers: false,
      manageContent: true,
      manageSettings: false,
      manageBackup: false,
    },
  },
  {
    id: "viewer",
    label: "Viewer",
    description: "Read-only access",
    permissions: {
      manageUsers: false,
      manageContent: false,
      manageSettings: false,
      manageBackup: false,
    },
  },
];

const updateRolesSchema = z.record(
  z.string(),
  z.object(
    Object.fromEntries(
      PERMISSION_KEYS.map((k: PermissionKey) => [k, z.boolean()])
    ) as Record<PermissionKey, z.ZodBoolean>
  )
);

async function ensureDefaultRoles() {
  const db = await getDb();
  const col = db.collection<RoleDocument>(ROLE_COLLECTION);
  const count = await col.countDocuments();
  if (count === 0) {
    const now = new Date();
    await col.insertMany(
      DEFAULT_ROLES.map((r) => ({
        ...r,
        createdAt: now,
        updatedAt: now,
      }))
    );
  }
}

export async function GET() {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  await ensureDefaultRoles();
  const db = await getDb();
  const col = db.collection<RoleDocument>(ROLE_COLLECTION);
  const docs = await col.find().sort({ id: 1 }).toArray();

  return NextResponse.json({ roles: docs.map(roleFromDocument) });
}

export async function PATCH(req: NextRequest) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 422 });
  }

  const parsed = updateRolesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const updates = parsed.data;
  const db = await getDb();
  const col = db.collection<RoleDocument>(ROLE_COLLECTION);

  // Update each role's permissions
  for (const [roleId, perms] of Object.entries(updates)) {
    // Prevent removing manageUsers from admin
    if (roleId === "admin" && !perms.manageUsers) {
      return NextResponse.json(
        { error: "Admin role must have user management permission" },
        { status: 400 }
      );
    }

    await col.updateOne(
      { id: roleId },
      {
        $set: {
          permissions: perms,
          updatedAt: new Date(),
        },
      }
    );
  }

  // Return updated roles
  const docs = await col.find().sort({ id: 1 }).toArray();
  return NextResponse.json({ roles: docs.map(roleFromDocument) });
}
