const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb').ObjectID;
require('dotenv').config();

const port = 5000;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.afd9x.mongodb.net:27017,cluster0-shard-00-01.afd9x.mongodb.net:27017,cluster0-shard-00-02.afd9x.mongodb.net:27017/my-volunteer-network?ssl=true&replicaSet=atlas-vjl1yh-shard-0&authSource=admin&retryWrites=true&w=majority`;
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
  const userCollection = client.db("my-volunteer-network").collection("volunteers");
  app.post('/addRegistration', (req, res) => {
    const newRegistration = req.body;
    userCollection.insertOne(newRegistration)
    .then( result => {
      res.send(result.insertedCount > 0)
    });
  });

  app.get('/volunteer', (req, res) => {
    userCollection.find({email : req.query.email})
    .toArray( (error, documents) => {
      res.send(documents);
    });
  });

  app.delete('/delete/:id', (req, res) => {
    userCollection.deleteOne({_id : ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    });
  });

});



app.get('/', (req, res) => {
    res.send("Hello Node.JS...");
})
app.listen(process.env.PORT || port);
