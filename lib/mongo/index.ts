import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

const URI = process.env.MONGODB_URI;
const options = {};

if (!URI)
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );

let client = new MongoClient(URI, options);
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV !== "production") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;
