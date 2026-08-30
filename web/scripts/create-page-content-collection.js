#!/usr/bin/env node
/**
 * Creates the page_content collection and initializes the Programs page content
 * Run: node scripts/create-page-content-collection.js
 */

const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Manual .env parsing (avoiding dotenv dependency)
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env");
  if (!fs.existsSync(envPath)) {
    console.error("❌ .env file not found at:", envPath);
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, "utf8");
  const lines = envContent.split("\n");
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    
    const [key, ...valueParts] = trimmed.split("=");
    if (key && valueParts.length > 0) {
      const value = valueParts.join("=").replace(/^["']|["']$/g, "");
      process.env[key.trim()] = value.trim();
    }
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || "pcm_web";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment");
  process.exit(1);
}

async function main() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(DB_NAME);
    const collections = await db.listCollections({ name: "page_content" }).toArray();

    if (collections.length === 0) {
      await db.createCollection("page_content");
      console.log("✅ Created page_content collection");
    } else {
      console.log("ℹ️  page_content collection already exists");
    }

    // Create unique index on slug
    const col = db.collection("page_content");
    await col.createIndex({ slug: 1 }, { unique: true, name: "uniq_slug" });
    console.log("✅ Created unique index on slug");

    // Initialize Programs page content (upsert)
    const programsPageContent = {
      slug: "programs",
      content: {
        hero: {
          title: "Academic Programs",
          subtitle: "Three Pokhara University bachelor's degrees, each built to turn four years of study into a career you're proud of.",
        },
        intro: {
          heading: "Choose your path",
          body: "Every PCM program blends conceptual depth with real-world practice, non-credit skill courses and internship experience.",
        },
        comparisonTable: {
          heading: "Compare the programs",
          columns: ["Program", "Focus", "Duration", "Credits", "Ideal for"],
        },
        cta: {
          heading: "Ready to choose your program?",
          body: "Apply online in minutes, or reach out and we'll guide you through every step.",
          phone: "(061) 544761",
        },
        featuredProgramRefs: ["bcsit", "bba", "bba-finance"],
      },
      updatedAt: new Date(),
    };

    const result = await col.updateOne(
      { slug: "programs" },
      {
        $set: programsPageContent,
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log("✅ Initialized Programs page content");
    } else if (result.modifiedCount > 0) {
      console.log("✅ Updated Programs page content");
    } else {
      console.log("ℹ️  Programs page content already exists (no changes)");
    }

    console.log("\n🎉 Setup complete!");
    console.log("\nNext steps:");
    console.log("1. Visit /admin/pages/programs to edit the Programs page content");
    console.log("2. Visit /programs to see the public page");
    console.log("3. Edit a program at /admin/content/programs/[slug] to test cache invalidation");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
