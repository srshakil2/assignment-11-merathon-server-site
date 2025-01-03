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
    const participerColection = client
      .db("marathon-play")
      .collection("participer");
    //
    app.get("/user", async (req, res) => {
      const users = marathonUserCalection.find();
      const result = await users.toArray();
      res.send(result);
    });
    // home page limit data
    app.get("/sixData", async (req, res) => {
      const users = dataCalection.find().limit(6);
      const result = await users.toArray();
      res.send(result);
    });
    app.get("/data", async (req, res) => {
      const users = dataCalection.find();
      const result = await users.toArray();
      res.send(result);
    });
    //
    app.get("/data/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataCalection.findOne(query);
      res.send(result);
    });
    // todo
    app.get("/data/singeldata/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const query = { email: email };
      // console.log(query);
      const result = await dataCalection.find(query).toArray();
      // const query = { _id: new ObjectId(id) };
      // const result = await dataCalection.findOne(query);
      res.send(result);
    });

    //
    app.get("/participer", async (req, res) => {
      const participers = participerColection.find();
      const result = await participers.toArray();
      res.send(result);
    });
    app.get("/participer/:email", async (req, res) => {
      const email = req.params?.email;
      const query = { email: email };
      const data = participerColection.find(query);
      const result = await data.toArray();
      res.send(result);
    });
    //
    // data post
    app.post("/data", async (req, res) => {
      const newData = req.body;
      // console.log(newData);
      const result = await dataCalection.insertOne(newData);
      res.send(result);
    });
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      const result = await marathonUserCalection.insertOne(newUser);
      res.send(result);
    });

    app.post("/participer", async (req, res) => {
      const newParticiper = req.body;
      const result = await participerColection.insertOne(newParticiper);
      res.send(result);
    });
    // Update user marathon details
    app.post("/participer/:id", async (req, res) => {
      const updatePartisiper = req.body;
      const query = { _id: new ObjectId(updatePartisiper?.id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          firstName: updatePartisiper?.firstName,
          lastName: updatePartisiper?.lastName,
          contact: updatePartisiper?.contact,
          info: updatePartisiper?.info,
        },
      };
      const result = await participerColection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });
    // delete user ditails
    app.delete("/participer/:id", async (req, res) => {
      const deleteInfo = req.params;
      const queryId = { _id: new ObjectId(deleteInfo?.id) };
      const result = await participerColection.deleteOne(queryId);
      res.send(result);
    });

    // deleteOne datacalection
    app.delete("/data/deleteOne/:id", async (req, res) => {
      const data = req.params.id;
      const query = { _id: new ObjectId(data) };
      console.log(data, query);
      const result = await dataCalection.deleteOne(query);
      res.send(result);
    });
    // datacalection update
    app.patch("/data/upDate/:id", async (req, res) => {
      const data = req.body;
      // console.log(data?.id);
      const query = { _id: new ObjectId(data.id) };
      // console.log(query);
      const upDateDoc = {
        $set: {
          marathon_title: data.marathon_title,
          marathon_image: data.marathon_image,
          location: data.location,
          start_registration_date: data.start_registration_date,
          end_registration_date: data.end_registration_date,
          description: data.description,
        },
      };
      // console.log(upDateDoc);
      const result = await dataCalection.updateOne(query, upDateDoc);
      res.send(result);
    });
    // incriment counter
    app.post("/data/:id", async (req, res) => {
      const updatedCount = req.body;
      const query = { _id: new ObjectId(updatedCount?._id) };
      const filter = await dataCalection.findOne(query);
      // console.log(filter);
      let total_registration_count = 0;
      if (filter?.total_registration_count) {
        total_registration_count = filter?.total_registration_count + 1;
      } else {
        total_registration_count = 1;
      }
      const updatedDoc = {
        $set: {
          total_registration_count,
          register_email: updatedCount?.email,
        },
      };
      // console.log(updatedCount, total_registration_count);
      const result = await dataCalection.updateOne(query, updatedDoc);
      res.send(result);
    });
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
