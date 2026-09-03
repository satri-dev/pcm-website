/* scripts/create-applications-collection.js
 * Creates/updates the "applications" collection with schema validation and indexes.
 * Run: node scripts/create-applications-collection.js
 * Reads MONGODB_URI / MONGODB_DB from the environment or web/.env
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { MongoClient } from "mongodb";

function loadEnv() {
  const envPath = join(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*(.+?)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

function dbNameFromUri(uri) {
  try {
    const noQuery = uri.split("?")[0];
    return noQuery.split("/").slice(3).join("/") || "";
  } catch {
    return "";
  }
}

const applicationsJsonSchema = {
  bsonType: "object",
  required: ["name", "email", "status", "submittedAt", "updatedAt"],
  properties: {
    name: { bsonType: "string" },
    email: { bsonType: "string" },
    phone: { bsonType: "string" },
    program: { bsonType: "string" },
    shift: { bsonType: "string" },
    status: {
      enum: ["new", "in-review", "accepted", "rejected"],
    },
    data: {
      bsonType: "object",
    },
    submittedAt: { bsonType: "date" },
    updatedAt: { bsonType: "date" },
    deletedAt: { bsonType: "date" },
    deletedBy: { bsonType: "string" },
  },
};

async function main() {
  loadEnv();
  const uri = process.env.MONGODB_URI;
  const dbName =
    process.env.MONGODB_DB || dbNameFromUri(uri || "") || "test";

  if (!uri) {
    console.error("Missing MONGODB_URI");
    process.exit(1);
  }
  console.log("Using database:", dbName);

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db(dbName);
    const collections = await db
      .listCollections({ name: "applications" })
      .toArray();

    if (collections.length === 0) {
      await db.createCollection("applications", {
        validator: { $jsonSchema: applicationsJsonSchema },
        validationLevel: "strict",
        validationAction: "error",
      });
      console.log('Created "applications" collection with schema validation');
    } else {
      await db.command({
        collMod: "applications",
        validator: { $jsonSchema: applicationsJsonSchema },
        validationLevel: "strict",
        validationAction: "error",
      });
      console.log('Updated validator on existing "applications" collection');
    }

    const col = db.collection("applications");
    const wanted = [
      { key: { submittedAt: -1 }, name: "submittedAt_desc" },
      { key: { status: 1 }, name: "status" },
      { key: { email: 1 }, name: "email" },
      { key: { name: "text", email: "text", phone: "text" }, name: "text_search" },
    ];

    const existing = await col.listIndexes().toArray();
    for (const idx of existing) {
      if (idx.name === "_id_") continue;
      const match = wanted.find((w) => w.name === idx.name);
      if (!match || JSON.stringify(match.key) !== JSON.stringify(idx.key)) {
        await col.dropIndex(idx.name);
        console.log("Dropped outdated index:", idx.name);
      }
    }

    await col.createIndexes(wanted);
    console.log("Indexes ensured:");
    for (const w of wanted) console.log(" ", w.name);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
