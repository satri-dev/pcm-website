import type { Metadata } from "next";
import { getDb } from "@/core/lib/db";
import { requireApiSession } from "@/core/lib/api-guard";
import { headers } from "next/headers";
import { auth } from "@/core/lib/auth";
import PageHeader from "../../_components/dashboard/page-header";
import UsersManager from "./_components/users-manager";
import {
  USER_COLLECTION,
  userFromDocument,
  type UserDocument,
} from "./types";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Users & Roles",
  description:
    "Manage admin accounts, user roles, and permissions for the PCM website admin panel.",
  robots: { index: false, follow: false },
};

export default async function UsersPage() {
  await connection();
  // Get current session for identifying the logged-in user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUserId = session?.user?.id;

  // Fetch users server-side
  const db = await getDb();
  const col = db.collection<UserDocument>(USER_COLLECTION);
  const docs = await col
    .find()
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  const users = docs.map(userFromDocument);

  return (
    <>
      <PageHeader title="Users & Roles" subtitle="System · Users" />
      <UsersManager initialData={users} currentUserId={currentUserId} />
    </>
  );
}
