const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

dotenv.config();

const username = encodeURIComponent(process.env.MONGO_USERNAME || "");
const password = encodeURIComponent(process.env.MONGO_PASSWORD || "");
const clusterUrl = process.env.MONGO_CLUSTER || "";
const databaseName = process.env.MONGO_DBNAME || "";

const uri = `mongodb+srv://${username}:${password}@${clusterUrl}/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`;

app.get("/", (req: any, res: { send: (arg0: string) => void }) => {
  console.log("/----------------");
  res.send("Express on Vercel");
});

app.get(
  "/check",
  async (
    req: any,
    res: {
      send: (arg0: any) => void;
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: { (arg0: string): void; new (): any };
      };
    }
  ) => {
    console.log("/check----------");

    try {
      const client = new MongoClient(uri);
      await client.connect();

      const database = client.db(databaseName);
      const collection = database.collection("users");

      const users = await collection.find({}).limit(4).toArray();

      res.send(users);
      console.log("users");
      console.log(users);
      await client.close();
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      res.status(500).send("Error connecting to MongoDB");
    }
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server ready on port ${port}.`));
