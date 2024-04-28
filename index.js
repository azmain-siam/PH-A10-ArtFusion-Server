const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ArtFusion Server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gjqtths.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const itemsCollection = client.db("itemsDB").collection("items");

    app.post("/items", async (req, res) => {
      const newItem = req.body;
      const result = await itemsCollection.insertOne(newItem);
      res.send(result);
    });

    app.get("/items", async (req, res) => {
      const cursor = itemsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/myList/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await itemsCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`ArtFusion Server is running on port: ${port}`);
});
