import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export default function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("Please add MONGODB_URI");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      if (!client) {
        client = new MongoClient(uri, {
          maxPoolSize: 50,
          minPoolSize: 5,
          maxIdleTimeMS: 30000,
        });
      }
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  if (!client) {
    client = new MongoClient(uri, {
      maxPoolSize: 50,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
    });
  }

  if (!clientPromise) {
    clientPromise = client.connect();
  }

  return clientPromise;
}