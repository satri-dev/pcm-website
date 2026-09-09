import getClientPromise from "./mongodb";

export async function getDb() {
  const client = await getClientPromise();
  const db = client.db(process.env.MONGODB_DB_NAME);
  return db;
}