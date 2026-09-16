// Script to fix all invalid image URLs across all collections
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

function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://");
}

async function fixAllBadImages() {
  console.log("🔄 Connecting to MongoDB...");
  const client = new MongoClient(MONGODB_URI as string);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("test");
    const validPlaceholder = "/images/hero-2.jpg";
    let totalFixed = 0;

    // Check events collection
    console.log("\n📋 Checking events collection...");
    const eventsCollection = db.collection("events");
    const events = await eventsCollection.find({}).toArray();
    
    for (const event of events) {
      const updates: any = {};
      let needsUpdate = false;

      // Check image field
      if (event.image && !isValidUrl(event.image)) {
        console.log(`  🔧 Fixing event "${event.title}" - invalid image: "${event.image}"`);
        updates.image = validPlaceholder;
        needsUpdate = true;
      }

      // Check featuredImage field
      if (event.featuredImage && !isValidUrl(event.featuredImage)) {
        console.log(`  🔧 Fixing event "${event.title}" - invalid featuredImage: "${event.featuredImage}"`);
        updates.featuredImage = validPlaceholder;
        needsUpdate = true;
      }

      // Check thumbnail field
      if (event.thumbnail && !isValidUrl(event.thumbnail)) {
        console.log(`  🔧 Fixing event "${event.title}" - invalid thumbnail: "${event.thumbnail}"`);
        updates.thumbnail = validPlaceholder;
        needsUpdate = true;
      }

      // Check any field that contains "Fugiat animi alias"
      const eventStr = JSON.stringify(event);
      if (eventStr.includes("Fugiat animi alias")) {
        Object.keys(event).forEach(key => {
          if (typeof event[key] === 'string' && 
              event[key].includes("Fugiat animi alias") && 
              !isValidUrl(event[key])) {
            console.log(`  🔧 Fixing event "${event.title}" - invalid ${key}: "${event[key]}"`);
            updates[key] = validPlaceholder;
            needsUpdate = true;
          }
        });
      }

      if (needsUpdate) {
        await eventsCollection.updateOne(
          { _id: event._id },
          { $set: { ...updates, updatedAt: new Date() } }
        );
        totalFixed++;
      }
    }

    // Check testimonials collection
    console.log("\n📋 Checking testimonials collection...");
    const testimonialsCollection = db.collection("testimonials");
    const testimonials = await testimonialsCollection.find({}).toArray();
    
    for (const testimonial of testimonials) {
      if (testimonial.photo && !isValidUrl(testimonial.photo)) {
        console.log(`  🔧 Fixing testimonial "${testimonial.name}" - invalid photo: "${testimonial.photo}"`);
        await testimonialsCollection.updateOne(
          { _id: testimonial._id },
          { $set: { photo: validPlaceholder, updatedAt: new Date() } }
        );
        totalFixed++;
      }
    }

    // Check homepage collection
    console.log("\n📋 Checking homepage collection...");
    const homepageCollection = db.collection("homepage");
    const homepage = await homepageCollection.findOne({});
    
    if (homepage) {
      let needsUpdate = false;
      const updates: any = {};

      // Check testimonials in homepage
      if (homepage.testimonials && Array.isArray(homepage.testimonials)) {
        homepage.testimonials.forEach((t: any, i: number) => {
          if (t.photo && !isValidUrl(t.photo)) {
            console.log(`  🔧 Fixing homepage testimonial "${t.name}" - invalid photo: "${t.photo}"`);
            if (!updates.testimonials) {
              updates.testimonials = [...homepage.testimonials];
            }
            updates.testimonials[i].photo = validPlaceholder;
            needsUpdate = true;
          }
        });
      }

      // Check hero slides
      if (homepage.heroSlides && Array.isArray(homepage.heroSlides)) {
        homepage.heroSlides.forEach((slide: any, i: number) => {
          if (slide.image && !isValidUrl(slide.image)) {
            console.log(`  🔧 Fixing homepage hero slide ${i + 1} - invalid image: "${slide.image}"`);
            if (!updates.heroSlides) {
              updates.heroSlides = [...homepage.heroSlides];
            }
            updates.heroSlides[i].image = validPlaceholder;
            needsUpdate = true;
          }
        });
      }

      if (needsUpdate) {
        await homepageCollection.updateOne(
          { _id: homepage._id },
          { $set: { ...updates, updatedAt: new Date() } }
        );
        totalFixed++;
      }
    }

    // Check news collection
    console.log("\n📋 Checking news collection...");
    const newsCollection = db.collection("news");
    const newsItems = await newsCollection.find({}).toArray();
    
    for (const newsItem of newsItems) {
      const updates: any = {};
      let needsUpdate = false;

      if (newsItem.featuredImage && !isValidUrl(newsItem.featuredImage)) {
        console.log(`  🔧 Fixing news "${newsItem.title}" - invalid featuredImage: "${newsItem.featuredImage}"`);
        updates.featuredImage = validPlaceholder;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await newsCollection.updateOne(
          { _id: newsItem._id },
          { $set: { ...updates, updatedAt: new Date() } }
        );
        totalFixed++;
      }
    }

    if (totalFixed > 0) {
      console.log(`\n✨ Fixed ${totalFixed} document(s) with invalid images!`);
    } else {
      console.log("\n✅ All images are valid!");
    }

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n👋 Disconnected from MongoDB");
  }
}

fixAllBadImages();
