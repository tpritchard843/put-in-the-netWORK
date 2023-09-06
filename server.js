const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
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
    app.use(bodyParser.json());

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
    // query param for id to get
    app.get('/persons/:id', async (req, res) => {
      console.log({
        requestParams: req.params,
        requestQuery: req.query
      });
      try {
        const {id: personId} = req.params;  //destructured req.params obj. {id: personId} = req.params === personId = req.params.id
        //console.log(personId);
        // use our id param to to query DB collection for the corresponding ID
        const person = await db.collection('persons').find({_id: new ObjectId(personId)}).toArray();
        if (!person) {
          console.log('error - user not found')
          res.status(404).json({error: 'User not found'});
        } else {
          res.send(person)
        }
      }
      catch (err) {
        res.status(500).json({error: 'something went wrong'})
        console.error(err);
      }
    })

    app.post('/persons', (req, res) =>{
      personsCollection
        .insertOne(req.body)
        .then(result => {
          res.redirect('/');
        })
        .catch(err => console.error(err))
    })

    //Update
    app.put('/quotes', (req, res) => {
      // personsCollection
      //   .findOneAndUpdate(param, update, options)
      //   .then(result => {
      //     res.redirect('/user-updated.html');
      //   })
      //   .catch(err => console.error(err))
    })

    //Delete
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })
  })
  .catch(err => console.error(err))
