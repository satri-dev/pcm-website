// Script to fix invalid event images in the database
import { MongoClient, ObjectId } from "mongodb";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env file");
  process.exit(1);
}

function isValidUrl(url: string | undefined): boolean {
  return !!url && (url.startsWith("/") || url.startsWith("http"));
}

async function fixEventImages() {
  console.log("🔄 Connecting to MongoDB...");
  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("test");
    const collection = db.collection("events");

    // Find all events
    const events = await collection.find({}).toArray();

    console.log(`\n📋 Found ${events.length} event(s)`);

    let fixed = 0;
    const defaultImage = "/images/hero-1.jpg";

    for (const event of events) {
      console.log(`\n🔍 Event: ${event.title}`);
      
      let needsUpdate = false;
      const updates: any = {};

      // Check image field
      if (event.image && !isValidUrl(event.image)) {
        console.log(`  ❌ Invalid image: "${event.image}"`);
        updates.image = defaultImage;
        needsUpdate = true;
      }

      // Check poster field
      if (event.poster && !isValidUrl(event.poster)) {
        console.log(`  ❌ Invalid poster: "${event.poster}"`);
        updates.poster = defaultImage;
        needsUpdate = true;
      }

      // Check thumbnailUrl field
      if (event.thumbnailUrl && !isValidUrl(event.thumbnailUrl)) {
        console.log(`  ❌ Invalid thumbnailUrl: "${event.thumbnailUrl}"`);
        updates.thumbnailUrl = defaultImage;
        needsUpdate = true;
      }

      // Check any other fields that might contain the bad data
      const eventStr = JSON.stringify(event);
      if (eventStr.includes("Fugiat animi alias")) {
        console.log(`  ⚠️  Document contains "Fugiat animi alias" - checking all fields...`);
        
        Object.keys(event).forEach(key => {
          if (typeof event[key] === 'string' && 
              event[key].includes("Fugiat animi alias") && 
              !isValidUrl(event[key])) {
            console.log(`  ❌ Invalid ${key}: "${event[key]}"`);
            updates[key] = defaultImage;
            needsUpdate = true;
          }
        });
      }

      if (needsUpdate) {
        updates.updatedAt = new Date();
        console.log(`  ✨ Updating event...`);
        await collection.updateOne(
          { _id: event._id },
          { $set: updates }
        );
        fixed++;
        console.log(`  ✅ Fixed!`);
      } else {
        console.log(`  ✅ All images valid`);
      }
    }

    console.log(`\n\n🎉 Fixed ${fixed} event(s)`);

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("👋 Disconnected from MongoDB");
  }
}

fixEventImages();
