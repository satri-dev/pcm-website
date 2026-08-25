/* scripts/create-news-collection.js
 * Creates/updates the "news" collection with schema validation and indexes.
 * Run: node scripts/create-news-collection.js
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

const newsJsonSchema = {
  bsonType: "object",
  required: [
    "title",
    "slug",
    "category",
    "publishedAt",
    "status",
    "featured",
    "views",
  ],
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
    category: {
      enum: ["News", "Event", "Student Blog", "Achievement"],
    },
    publishedAt: {
      bsonType: "date",
    },
    image: {
      bsonType: "string",
      description: "Public image URL",
    },
    excerpt: {
      bsonType: "string",
      maxLength: 1000,
    },
    content: {
      bsonType: "string",
      description: "Full article content, preferably sanitized HTML",
    },
    featured: {
      bsonType: "bool",
    },
    status: {
      enum: ["published", "draft"],
    },
    views: {
      bsonType: "int",
      minimum: 0,
    },
    author: {
      bsonType: "string",
    },
    seo: {
      bsonType: "object",
      properties: {
        title: { bsonType: "string", maxLength: 60 },
        description: { bsonType: "string", maxLength: 160 },
        keywords: { bsonType: "array", items: { bsonType: "string" } },
      },
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
  // Same effective fallback as the app: MONGODB_DB, then the URI path,
  // then the driver default ("test").
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
    const collections = await db.listCollections({ name: "news" }).toArray();

    if (collections.length === 0) {
      await db.createCollection("news", {
        validator: { $jsonSchema: newsJsonSchema },
        validationLevel: "strict",
        validationAction: "error",
      });
      console.log('Created "news" collection with schema validation');
    } else {
      await db.command({
        collMod: "news",
        validator: { $jsonSchema: newsJsonSchema },
        validationLevel: "strict",
        validationAction: "error",
      });
      console.log('Updated validator on existing "news" collection');
    }

    const news = db.collection("news");
    const wanted = [
      { key: { slug: 1 }, name: "uniq_slug", unique: true },
      { key: { status: 1, publishedAt: -1 }, name: "status_published_desc" },
      { key: { category: 1 }, name: "category" },
      { key: { featured: 1 }, name: "featured" },
      { key: { title: "text", excerpt: "text" }, name: "text_search" },
    ];

    // Drop indexes whose definition no longer matches (e.g. renamed fields)
    const existing = await news.listIndexes().toArray();
    for (const idx of existing) {
      if (idx.name === "_id_") continue;
      const match = wanted.find((w) => w.name === idx.name);
      if (!match || JSON.stringify(match.key) !== JSON.stringify(idx.key)) {
        await news.dropIndex(idx.name);
        console.log("Dropped outdated index:", idx.name);
      }
    }

    await news.createIndexes(wanted);
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
