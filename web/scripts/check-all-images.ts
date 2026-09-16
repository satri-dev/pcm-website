// Script to check all image URLs in the database
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env file");
  process.exit(1);
}

const mongoUri: string = MONGODB_URI;

function isValidUrl(url: string): boolean {
  return !!url && (url.startsWith("/") || url.startsWith("http"));
}

async function checkAllImages() {
  console.log("🔄 Connecting to MongoDB...");
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("test");
    const collection = db.collection("homepage");

    const doc = await collection.findOne({});

    if (!doc) {
      console.log("ℹ️  No homepage document found");
      return;
    }

    console.log("\n🔍 Checking all images in homepage...\n");

    // Check hero slides
    if (doc.heroSlides) {
      console.log("🎨 Hero Slides:");
      doc.heroSlides.forEach((slide: any, i: number) => {
        const valid = isValidUrl(slide.image);
        console.log(`  ${i + 1}. ${slide.id || "Unnamed"}: ${valid ? "✅" : "❌"} "${slide.image}"`);
      });
    }

    // Check testimonials
    if (doc.testimonials) {
      console.log("\n💬 Testimonials:");
      doc.testimonials.forEach((t: any, i: number) => {
        const valid = isValidUrl(t.photo);
        console.log(`  ${i + 1}. ${t.name}: ${valid ? "✅" : "❌"} "${t.photo}"`);
      });
    }

    // Check admission poster
    if (doc.admission) {
      console.log("\n🎓 Admission:");
      const valid = isValidUrl(doc.admission.posterImage);
      console.log(`  Poster: ${valid ? "✅" : "❌"} "${doc.admission.posterImage}"`);
    }

    // Now let's check all collections for any invalid images
    console.log("\n\n🔍 Checking other collections...\n");

    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      if (col.name === "homepage") continue;
      
      const coll = db.collection(col.name);
      const docs = await coll.find({}).limit(10).toArray();
      
      let foundIssue = false;
      for (const d of docs) {
        const str = JSON.stringify(d);
        if (str.includes("Fugiat animi alias")) {
          if (!foundIssue) {
            console.log(`\n❌ Found "Fugiat animi alias" in collection: ${col.name}`);
            foundIssue = true;
          }
          console.log(`  Document ID: ${d._id}`);
          console.log(`  Content: ${str.substring(0, 200)}...`);
        }
      }
    }

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n👋 Disconnected from MongoDB");
  }
}

checkAllImages();
