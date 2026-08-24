import { getDb } from "@/core/lib/db";
import { User } from "@/types/user";

export async function createUser(user: User) {
  const db = await getDb();

  return db.collection<User>("users").insertOne(user);
}

export async function findUserByEmail(email: string) {
  const db = await getDb();

  return db.collection<User>("users").findOne({
    email,
  });
}

export async function findUserById(id: string) {
  const db = await getDb();

  return db.collection<User>("users").findOne({
    _id: id,
  });
}