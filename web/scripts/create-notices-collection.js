/* scripts/create-notices-collection.js
 * Creates/updates the "notices" collection with schema validation and indexes.
 * Run: node scripts/create-notices-collection.js
 * Reads MONGODB_URI / MONGODB_DB from the environment or web/.env
 */
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
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

const noticesJsonSchema = {
  bsonType: "object",
  required: ["title", "slug", "category", "date", "status", "views"],
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
    description: {
      bsonType: "string",
      maxLength: 2000,
    },
    category: {
      enum: ["General", "Academic", "Examination", "Administrative", "Event", "Circular"],
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
    const collections = await db.listCollections({ name: "notices" }).toArray();

    if (collections.length === 0) {
      await db.createCollection("notices", {
        validator: { $jsonSchema: noticesJsonSchema },
        validationLevel: "strict",
        validationAction: "error",
      });
      console.log('Created "notices" collection with schema validation');
    } else {
      await db.command({
        collMod: "notices",
        validator: { $jsonSchema: noticesJsonSchema },
        validationLevel: "strict",
        validationAction: "error",
      });
      console.log('Updated validator on existing "notices" collection');
    }

    const col = db.collection("notices");
    const wanted = [
      { key: { slug: 1 }, name: "uniq_slug", unique: true },
      { key: { status: 1, date: -1 }, name: "status_date_desc" },
      { key: { category: 1 }, name: "category" },
      { key: { title: "text", description: "text" }, name: "text_search" },
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
