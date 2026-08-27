import { ObjectId } from "mongodb";

/* ── User roles ── */
export const USER_ROLES = ["admin", "editor", "viewer"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const DEFAULT_PASSWORD = "Password@123";

/* ── Permission keys ── */
export const PERMISSION_KEYS = [
  "manageUsers",
  "manageContent",
  "manageSettings",
  "manageBackup",
] as const;
export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export interface PermissionDef {
  key: PermissionKey;
  label: string;
}

export const PERMISSION_LIST: PermissionDef[] = [
  { key: "manageUsers", label: "Manage Users" },
  { key: "manageContent", label: "Manage Content" },
  { key: "manageSettings", label: "Manage Settings" },
  { key: "manageBackup", label: "Manage Backups" },
];

/* ── API/UI-facing types ── */
export interface UserEntry {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  banned: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountEntry {
  id: string;
  userId: string;
  accountId: string;
  providerId: string;
  createdAt: string;
}

export interface RoleDefinition {
  id: string;
  label: string;
  description: string;
  permissions: Record<PermissionKey, boolean>;
}

/* ── MongoDB document shapes ── */
export interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  username: string;
  role: string;
  banned?: boolean;
  bannedReason?: string;
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountDocument {
  _id?: ObjectId;
  userId: string;
  accountId: string;
  providerId: string;
  password?: string;
  createdAt: Date;
}

export interface SessionDocument {
  _id?: ObjectId;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface RoleDocument {
  _id?: ObjectId;
  id: string;
  label: string;
  description: string;
  permissions: Record<PermissionKey, boolean>;
  createdAt: Date;
  updatedAt: Date;
}

/* ── Collection names ── */
export const USER_COLLECTION = "user";
export const ACCOUNT_COLLECTION = "account";
export const SESSION_COLLECTION = "session";
export const ROLE_COLLECTION = "roles";

/* ── Converter helpers ── */
export function userFromDocument(doc: UserDocument): UserEntry {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    username: doc.username,
    role: doc.role,
    banned: doc.banned ?? false,
    emailVerified: doc.emailVerified ?? false,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
  };
}

export function accountFromDocument(doc: AccountDocument): AccountEntry {
  return {
    id: String(doc._id),
    userId: doc.userId,
    accountId: doc.accountId,
    providerId: doc.providerId,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
  };
}

export function roleFromDocument(doc: RoleDocument): RoleDefinition {
  return {
    id: doc.id,
    label: doc.label,
    description: doc.description,
    permissions: doc.permissions,
  };
}
