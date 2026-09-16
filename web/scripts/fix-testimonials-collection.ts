// Script to fix invalid testimonial photos in the testimonials collection
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

async function fixTestimonialsCollection() {
  console.log("🔄 Connecting to MongoDB...");
  const client = new MongoClient(MONGODB_URI as string);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("test");
    const collection = db.collection("testimonials");

    // Find all testimonials
    const docs = await collection.find({}).toArray();

    if (docs.length === 0) {
      console.log("ℹ️  No testimonials found");
      return;
    }

    console.log(`\n📋 Found ${docs.length} testimonials`);

    // Find and fix invalid photo URLs
    let fixed = 0;
    const validPhotos = [
      "/images/hero-2.jpg",
      "/images/about-2.jpg",
      "/images/hero-5.jpg",
      "/images/hero-6.jpg",
    ];

    for (const doc of docs) {
      const isValidUrl = doc.photo && 
        (doc.photo.startsWith("/") || 
         doc.photo.startsWith("http://") || 
         doc.photo.startsWith("https://"));

      if (!isValidUrl) {
        console.log(`\n🔧 Fixing invalid photo for ${doc.name}: "${doc.photo}"`);
        const newPhoto = validPhotos[fixed % validPhotos.length];
        
        await collection.updateOne(
          { _id: doc._id },
          { 
            $set: { 
              photo: newPhoto,
              updatedAt: new Date()
            }
          }
        );
        
        console.log(`   ✅ Updated to: "${newPhoto}"`);
        fixed++;
      }
    }

    if (fixed > 0) {
      console.log(`\n✨ Fixed ${fixed} testimonial(s)!`);
    } else {
      console.log("\n✅ All testimonials already have valid photos");
    }

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n👋 Disconnected from MongoDB");
  }
}

fixTestimonialsCollection();
