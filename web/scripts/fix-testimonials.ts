// Script to fix invalid testimonial photos in the database
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

async function fixTestimonials() {
  console.log("🔄 Connecting to MongoDB...");
  const client = new MongoClient(MONGODB_URI as string);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("test"); // Default database name
    const collection = db.collection("homepage");

    // Find documents with invalid testimonial photos
    const doc = await collection.findOne({});

    if (!doc) {
      console.log("ℹ️  No homepage document found");
      return;
    }

    console.log("\n📋 Current testimonials:");
    if (doc.testimonials) {
      doc.testimonials.forEach((t: any, i: number) => {
        console.log(`  ${i + 1}. ${t.name}: "${t.photo}"`);
      });
    }

    // Fix invalid photo URLs
    let fixed = 0;
    const validPhotos = [
      "/images/hero-2.jpg",
      "/images/about-2.jpg",
      "/images/hero-5.jpg",
      "/images/hero-6.jpg",
    ];

    if (doc.testimonials) {
      doc.testimonials.forEach((t: any, i: number) => {
        const isValidUrl = t.photo && 
          (t.photo.startsWith("/") || 
           t.photo.startsWith("http://") || 
           t.photo.startsWith("https://"));
        
        if (!isValidUrl) {
          console.log(`\n🔧 Fixing invalid photo for ${t.name}: "${t.photo}"`);
          t.photo = validPhotos[i % validPhotos.length];
          fixed++;
        }
      });
    }

    if (fixed > 0) {
      console.log(`\n✨ Updating ${fixed} testimonial(s)...`);
      await collection.updateOne(
        { _id: doc._id },
        { 
          $set: { 
            testimonials: doc.testimonials,
            updatedAt: new Date()
          }
        }
      );
      console.log("✅ Testimonials fixed!");
    } else {
      console.log("\n✅ All testimonials already have valid photos");
    }

    console.log("\n📋 Updated testimonials:");
    if (doc.testimonials) {
      doc.testimonials.forEach((t: any, i: number) => {
        console.log(`  ${i + 1}. ${t.name}: "${t.photo}"`);
      });
    }

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n👋 Disconnected from MongoDB");
  }
}

fixTestimonials();
