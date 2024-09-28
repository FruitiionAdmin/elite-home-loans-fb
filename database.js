require('dotenv').config();
import { MongoClient, ObjectID } from 'mongodb';


const uri = process.env.DB_URI;

let cached = global.mongo

if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    cached.promise = MongoClient.connect(uri, opts).then((client) => {
      return {
        client,
        db: client.db("elitehomeloans"),
      }
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export function objectId(id) {
  return ObjectID(id);
}