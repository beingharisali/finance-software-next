
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URL;

if (!MONGO_URI) throw new Error("Please define MONGO_URL in .env.local");

async function dbConnect() {
  return mongoose.connect(MONGO_URI);
}

export default dbConnect;
