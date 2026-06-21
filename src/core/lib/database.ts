import mongoose from "mongoose";
import { getRequiredEnv } from "@/core/config/env";

const MONGODB_URI = getRequiredEnv("MONGODB_URI");

type GlobalWithMongoose = typeof globalThis & {
  mongooseCache?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

const g = global as GlobalWithMongoose;

if (!g.mongooseCache) {
  g.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (g.mongooseCache?.conn) return g.mongooseCache.conn;
  if (!g.mongooseCache?.promise) {
    g.mongooseCache!.promise = mongoose.connect(MONGODB_URI, { 
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }
  g.mongooseCache!.conn = await g.mongooseCache!.promise;
  return g.mongooseCache!.conn;
}

// Warm up connection on startup
connectToDatabase().catch(console.error);
