import { ObjectId } from "mongodb";
import { TEventsCard, TParticipan } from "./types";

const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

dotenv.config();

const username = encodeURIComponent(process.env.MONGO_USERNAME || "");
const password = encodeURIComponent(process.env.MONGO_PASSWORD || "");
const clusterUrl = process.env.MONGO_CLUSTER || "";
const databaseName = process.env.MONGO_DBNAME || "";

const uri = `mongodb+srv://${username}:${password}@${clusterUrl}/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`;

async function getCardsByPage<T>(
  skip: number,
  collectionName: string,
  searchCriteria: {} = {}
): Promise<{
  totalCardCount: number;
  cards: Array<T>;
}> {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    const cards = await collection
      .find(searchCriteria)
      .skip(skip)
      .limit(5)
      .toArray();
    const totalCardCount = await collection.countDocuments(searchCriteria);

    return { totalCardCount, cards };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  } finally {
    await client.close();
  }
}

app.use(cors());
app.use(express.json());

app.get(
  "/",
  async (
    req: any,
    res: {
      json: any;
      status: any;
      send: (arg0: string) => void;
    }
  ) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * 4;
      const { totalCardCount, cards } = await getCardsByPage<TEventsCard>(
        skip,
        "events"
      );
      res.json({ totalCardCount, cards });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.get(
  "/participans",
  async (
    req: any,
    res: {
      json(arg0: { totalCardCount: number; cards: TParticipan[] }): unknown;
      send: (arg0: any) => void;
      status: (arg0: number) => {
        json: any;
        (): any;
        new (): any;
        send: { (arg0: string): void; new (): any };
      };
    }
  ) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const eventId = req.query.eventId;

      const skip = (page - 1) * 4;
      const searchCriteria = {
        event_id: new ObjectId(eventId),
      };

      const { totalCardCount, cards } = await getCardsByPage<TParticipan>(
        skip,
        "participans",
        searchCriteria
      );
      res.json({ totalCardCount, cards });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.post(
  "/registration",
  async (
    req: { body: any },
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: { id?: any; message?: string }): void; new (): any };
      };
    }
  ) => {
    const participant = req.body;

    const client = new MongoClient(uri);

    try {
      await client.connect();
      console.log("Connected to MongoDB");

      const database = client.db(databaseName);
      const collection = database.collection("participans");

      const result = await collection.insertOne(participant);
      console.log(`Participant added with ID: ${result._id}`);

      res.status(201).json({ id: result.insertedId });
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      res.status(500).json({ message: "Internal server error" });
    } finally {
      await client.close();
    }
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server ready on port ${port}.`));
