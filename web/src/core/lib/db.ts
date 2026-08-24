import clientPromise from "./mongodb";

export async function getDb() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  return db;
}