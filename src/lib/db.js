import { MongoClient } from "mongodb";
import { MONGODB_URI } from "astro:env/server";

if (!MONGODB_URI) {
  throw new Error('Invalid environment variable: "MONGODB_URI"');
}

const uri = MONGODB_URI;
const options = {};
let client;
let clientPromise;

if (!globalThis._mongoClientPromise) {
  client = new MongoClient(uri, options);
  globalThis._mongoClientPromise = client.connect();
}
clientPromise = globalThis._mongoClientPromise;

const connectToDB = async () => {
  if (!clientPromise) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
    globalThis._mongoClientPromise = clientPromise;
  }
  const MongoClient = await clientPromise;
  return MongoClient.db("Watchlist");
};

export const getDB = async () => {
  const mongo = await connectToDB();
  return mongo;
};

export const MovieCollection = async () => {
  const db = await getDB();
  return db.collection("movievault");
};

export const ShowCollection = async () => {
  const db = await getDB();
  return db.collection("showvault");
};
