const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const morgan = require('morgan');
const express = require('express');
const app = express();
const PORT = 3001;
require('dotenv').config();

const connectionString = `mongodb+srv://${encodeURIComponent(process.env._mongoUsername)}:${encodeURIComponent(process.env._mongoPassword)}@cluster0.uh4bxo2.mongodb.net/`;

MongoClient.connect(connectionString)
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('networking-rolodex');
    const personsCollection = db.collection('persons');

    // Middleware
    app.use(express.json());
    app.use(express.static('public'));''
    app.use(bodyParser.urlencoded({ extended: true }));


    //CRUD methods
    app.get('/', (req, res) => {
      db.collection('persons')
        .find()
        .toArray()
        .then(results => {
          res.sendFile(__dirname + '/index.html');
        })
        .catch(err => console.error(err))
    })
    app.get('/persons', (req, res) => {
      db.collection('persons')
        .find()
        .toArray()
        .then(results => {
          res.send(results);
        })
        .catch(err => console.error(err))
    })

    app.post('/persons', (req, res) =>{
      personsCollection
        .insertOne(req.body)
        .then(result => {
          res.redirect('/');
        })
        .catch(err => console.error(err))
    })
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })
  })
  .catch(err => console.error(err))
