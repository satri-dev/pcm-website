import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add MONGODB_URI");
}

const client = new MongoClient(uri, {
  maxPoolSize: 50,      // Allow up to 50 concurrent connections
  minPoolSize: 5,       // Keep 5 connections ready
  maxIdleTimeMS: 30000, // Close idle connections after 30s
});

let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;