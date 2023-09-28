const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { v4: uuidv4 }= require('uuid');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
require('dotenv').config();


class Person {
  constructor(name, email, company, dateAdded, spark) {
    this.name = name;
    this.email = email;
    this.company = company;
    this.dateAdded = dateAdded;
    this.spark = spark;
    this.uuid = uuidv4();
  }
}

const connectionString = process.env.DB_STRING;

MongoClient.connect(connectionString)
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('networking-rolodex');
    const personsCollection = db.collection('persons');
    const usersCollection = db.collection('users');

    // Middleware
    app.set('view engine', 'ejs');
    app.use(express.json());
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());

    //CRUD methods
    //READ
    // app.get('/', (req, res) => {
    //   db.collection('persons')
    //     .find()
    //     .sort({name: 1})
    //     .toArray()
    //     .then(persons => {
    //       res.render('user-contacts.ejs', {persons: persons});
    //     })
    //     .catch(err => console.error(err))
    // })
    app.get('/', (req, res) => {
      db.collection('persons')
        .find()
        .sort({name: 1})
        .toArray()
        .then(persons => {
          res.render('index.ejs', {persons: persons});
        })
        .catch(err => console.error(err))
    })
    app.get('/persons', (req, res) => {
      db.collection('persons')
        .find()
        .sort({name: 1})
        .toArray()
        .then(results => {
          res.send(results);
        })
        .catch(err => console.error(err))
    })
    app.get('/persons/:id', async (req, res) => {
      console.log({
        requestParams: req.params,
        requestQuery: req.query
      });
      try {
        const {id: personId} = req.params;  //destructured req.params obj. {id: personId} = req.params === personId = req.params.id
        //console.log(personId);
        // use our id param to to query DB collection for the corresponding ID
        const person = await db.collection('persons').find({ uuid: personId }).toArray();
        if (!person) {
          console.log('error - user not found')
          res.status(404).json({error: 'User not found'});
        } else {
          res.send(person);
        }
      }
      catch (err) {
        res.status(500).json({error: 'something went wrong'});
        console.error(err);
      }
    })
    //CREATE
    app.post('/persons', (req, res) =>{
      let newPerson = new Person(req.body.name, req.body.email, req.body.company, req.body.dateAdded, req.body.spark);
      personsCollection
        .insertOne(newPerson)
        .then(result => {
          res.redirect('/');
        })
        .catch(err => console.error(err))
    })

    app.post('/signup', async(req, res) => {
      try {
        await usersCollection
        .insertOne({
          username: req.body.username,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8),
          uuid: uuidv4(),
        })
        console.log(`User ${req.body.username} was successfully added to the database.`);
        res.render('signupSucceeded.ejs');
      }
      catch (err) {
        res.render('signupFailed.ejs');
        console.error(err);
      }
    })

    app.post('/login', async(req, res) => {
      try{
        const user = await usersCollection
          .findOne({
          username: req.body.username
        })

        if(!user) {
          return res.status(404).send({message: 'User not found.'});
        }

        let passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        )

        if(!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid password."
          })
        }
        if (passwordIsValid) {
          const token = jwt.sign({ uuid: user.uuid },
            process.env.JWT_SECRET,
            {
              algorithm: 'HS256',
              allowInsecureKeySizes: true,
              expiresIn: 86400, // 24 hours
            });
          return res.status(200).send({
            uuid: user.uuid,
            username: user.username,
            email: user.email,
            accessToken: token
          });
        }
      }
      catch(err) {
        res.status(500).json({error: 'something went wrong'});
        console.error(err);
      }
    })

    //UPDATE
    app.put('/persons/:id', async(req, res) => {
      try {
        const { id: personId } = req.params;  //destructured req.params obj. {id: personId} = req.params === personId = req.params.id
        //console.log(personId);
        // use our id param to to query DB collection for the corresponding ID
        console.log(req.body);
        const person = await db.collection('persons').findOneAndUpdate(
          { uuid: personId },
          {
            $set: {
              name: req.body.name,
              email: req.body.email,
              company: req.body.company,
              spark: req.body.spark
            }
          }
          );
        res.json(person);
      }
      catch (err) {
        res.status(500).json({error: 'something went wrong'});
        console.error(err);
      }
    })

    //DELETE
    app.delete('/persons/:id', async (req, res) => {
      try {
        const { id: personId } = req.params;  //destructured req.params obj. {id: personId} = req.params === personId = req.params.id
        //console.log(personId);
        // use our id param to to query DB collection for the corresponding ID
        const person = await db.collection('persons').deleteOne({ uuid: personId });
        if (!person) {
          console.log('error - user not found')
          res.status(404).json({error: 'Error deleting user'});
        } else {
          res.send(person);
        }
      }
      catch (err) {
        res.status(500).json({error: 'something went wrong'})
        console.error(err);
      }
    })

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })
  })
  .catch(err => console.error(err))
