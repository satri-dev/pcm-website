/* scripts/create-results-collection.js
 * Creates/updates the "results" collection with schema validation and indexes.
 * Run: node scripts/create-results-collection.js
 * Reads MONGODB_URI / MONGODB_DB from the environment or web/.env
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { MongoClient } from "mongodb";

function loadEnv() {
  const envPath = join(__dirname, "..", ".env");
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

const resultsJsonSchema = {
  bsonType: "object",
  required: ["title", "slug", "program", "date", "status", "views"],
  properties: {
    title: {
      bsonType: "string",
      minLength: 3,
      maxLength: 200,
    },
    slug: {
      bsonType: "string",
      pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
    },
    program: {
      enum: ["BBA", "BCSIT", "BBA-Finance"],
    },
    date: {
      bsonType: "date",
    },
    status: {
      enum: ["published", "draft"],
    },
    views: {
      bsonType: "int",
      minimum: 0,
    },
    fileUrl: {
      bsonType: "string",
      description: "URL or data URI of attached file",
    },
    fileName: {
      bsonType: "string",
      description: "Original filename of the attachment",
    },
    createdAt: {
      bsonType: "date",
    },
    updatedAt: {
      bsonType: "date",
    },
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
    const collections = await db.listCollections({ name: "results" }).toArray();

    if (collections.length === 0) {
      await db.createCollection("results", {
        validator: { $jsonSchema: resultsJsonSchema },
        validationLevel: "strict",
        validationAction: "error",
      });
      console.log('Created "results" collection with schema validation');
    } else {
      await db.command({
        collMod: "results",
        validator: { $jsonSchema: resultsJsonSchema },
        validationLevel: "strict",
        validationAction: "error",
      });
      console.log('Updated validator on existing "results" collection');
    }

    const col = db.collection("results");
    const wanted = [
      { key: { slug: 1 }, name: "uniq_slug", unique: true },
      { key: { status: 1, date: -1 }, name: "status_date_desc" },
      { key: { program: 1 }, name: "program" },
      { key: { title: "text" }, name: "text_search" },
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
