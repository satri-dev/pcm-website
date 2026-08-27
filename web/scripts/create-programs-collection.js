/* scripts/create-programs-collection.js
 * Creates/updates the "programs" collection with schema validation and indexes.
 * Run: node scripts/create-programs-collection.js
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

const programsJsonSchema = {
  bsonType: "object",
  required: ["name", "slug", "code", "level", "duration", "seats", "status", "intro", "eligibility", "views"],
  properties: {
    name: {
      bsonType: "string",
      minLength: 3,
      maxLength: 200,
    },
    slug: {
      bsonType: "string",
      pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
    },
    code: {
      bsonType: "string",
      maxLength: 50,
    },
    level: {
      enum: ["Bachelor", "Bachelor (Finance)", "Bachelor (IT)"],
    },
    duration: {
      bsonType: "string",
      maxLength: 50,
    },
    seats: {
      bsonType: "int",
      minimum: 0,
    },
    status: {
      enum: ["open", "closed"],
    },
    image: {
      bsonType: "string",
      description: "Program image URL or data URI",
    },
    intro: {
      bsonType: "string",
      maxLength: 5000,
    },
    eligibility: {
      bsonType: "string",
      maxLength: 5000,
    },
    views: {
      bsonType: "int",
      minimum: 0,
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
    const collections = await db.listCollections({ name: "programs" }).toArray();

    if (collections.length === 0) {
      await db.createCollection("programs", {
        validator: { $jsonSchema: programsJsonSchema },
        validationLevel: "strict",
        validationAction: "error",
      });
      console.log('Created "programs" collection with schema validation');
    } else {
      await db.command({
        collMod: "programs",
        validator: { $jsonSchema: programsJsonSchema },
        validationLevel: "strict",
        validationAction: "error",
      });
      console.log('Updated validator on existing "programs" collection');
    }

    const col = db.collection("programs");
    const wanted = [
      { key: { slug: 1 }, name: "uniq_slug", unique: true },
      { key: { status: 1, createdAt: -1 }, name: "status_created_desc" },
      { key: { level: 1 }, name: "level" },
      { key: { name: "text", code: "text" }, name: "text_search" },
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
