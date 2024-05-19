const express = require("express");
const app = express();
const dotenv =  require("dotenv");

dotenv.config();
const username = encodeURIComponent(process.env.MONGO_USERNAME || '');
const password = encodeURIComponent(process.env.MONGO_PASSWORD || '');
const clusterUrl = process.env.MONGO_CLUSTER || '';
const databaseName = process.env.MONGO_DBNAME || '';

var uri = `mongodb+srv://${username}:${password}@${clusterUrl}/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`;

let baseUsers: string = "none";

var MongoClient = require('mongodb').MongoClient;
async function main() {
  const client = new MongoClient(uri);

  try {
    // Підключаємося до MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Вибираємо базу даних і колекцію
    const database = client.db('sample_mflix');
    const collection = database.collection('users');

    // Отримуємо дані з колекції
    const users = await collection.find({}).toArray();
    console.log('Users:', users);
    baseUsers = users;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    // Закриваємо підключення до MongoDB
    await client.close();
  }
}

// Викликаємо основну функцію
main().catch(console.error);

app.get("/", (req: any, res: { send: (arg0: string) => any; }) => {
	console.log("/----------------");
  res.send("Express on Vercel")
	
});

app.get("/check", (req: any, res: { send: (arg0: string) => any; }) => {
  console.log("/check----------");
	res.send(baseUsers);
	
});

app.listen(3000, () => console.log("Server ready on port 3000."));