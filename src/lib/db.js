import { MongoClient } from "mongodb";
import { MONGODB_URI } from "astro:env/server";

if (!MONGODB_URI) {
  throw new Error('Invalid environment variable: "MONGODB_URI"');
}

const uri = MONGODB_URI;
const options = {};
const connectToDB = async () => {
  const mongo = await new MongoClient(uri, options).connect();

  return mongo.db("Watchlist");
};

export const getDB = async () => {
  const mongo = await connectToDB();
  return mongo;
};

export const MovieCollection = async () => {
  const db = await getDB();
  return db.collection("movievault");
};
