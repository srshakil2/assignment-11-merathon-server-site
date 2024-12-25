const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mp1yd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // work

    const marathonUserCalection = client
      .db("marathon-play")
      .collection("users");
    const dataCalection = client.db("marathon-play").collection("marathons");
    //
    app.get("/user", async (req, res) => {
      const users = marathonUserCalection.find();
      const result = await users.toArray();
      res.send(result);
    });
    app.get("/data", async (req, res) => {
      const users = dataCalection.find();
      const result = await users.toArray();
      res.send(result);
    });
    app.get("/data/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataCalection.findOne(query);
      res.send(result);
    });
    //
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      const result = await marathonUserCalection.insertOne(newUser);
      res.send(result);
    });
    // app.put("/data/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true };
    //   const data = req.body;
    //   const item = {
    //     $set: {
    //       user_email: data.userEmail,
    //     },
    //   };
    //   const result = await dataCalection.updateOne(filter, item, options);
    //   res.send(result);
    // });
    // work
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//
app.get("/", (req, res) => {
  res.send("marathon is running for you");
});
app.listen(port, () => {
  console.log(`marathon is at: ${port}`);
});
