import {MongoClient} from "mongodb";

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);
await client.connect();
const db = client;

export default db;
