const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { v4: uuidv4 }= require('uuid');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const jwtMiddleware = require('./middlewares/authJwt');

class Person {
  constructor(name, email, company, dateAdded, spark, uuid) {
    this.name = name;
    this.email = email;
    this.company = company;
    this.dateAdded = dateAdded;
    this.spark = spark;
    this.uuid = uuid; // personId associated with user in DB
    this.contactId= uuidv4();
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
    app.use(cookieParser());
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
      try {
        res.render('index.ejs');
      }
      catch (err) {
        console.error(err);
      }
    })

    app.get('/persons', jwtMiddleware.authorization, async (req, res) => {
      try {
        const personId = req.userId;
        const persons = await db.collection('persons')
          .find({ uuid: personId })
          .sort({name: 1})
          .toArray();
        if (!persons) {
          console.log('error - could not find user collection')
          res.status(404).json({error: 'Collectrion not found'});
        } else {
          res.status(200).render('userContacts.ejs', {persons: persons});
        }
      }
      catch (err) {
        res.status(500).json({error: 'something went wrong'});
        console.error(err);
      }
    })

    app.get('/persons/:contactId', async (req, res) => {
      console.log({
        requestParams: req.params,
        requestQuery: req.query
      });
      try {
        const {contactId: cardId} = req.params;  //destructured req.params obj. {id: personId} = req.params === personId = req.params.id
        //console.log(personId);
        // use our id param to to query DB collection for the corresponding ID
        const person = await db.collection('persons').find({ contactId: cardId}).toArray();
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
    app.post('/persons', jwtMiddleware.authorization ,(req, res) =>{
      const personId = req.userId;
      let newPerson = new Person(req.body.name, req.body.email, req.body.company, req.body.dateAdded, req.body.spark, personId);
      console.log(newPerson);
      personsCollection
        .insertOne(newPerson)
        .then(result => {
          res.redirect('/persons');
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

    app.post('/login', async (req, res) => {
      try{
        const user = await usersCollection
          .findOne({
          username: req.body.username
        })

        if(!user) {
          return res.status(404).send({message: 'User not found.', status: 404});
        }

        let passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        )

        if(!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: 'Invalid password.',
            status: 401
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

            return res
              .cookie('accessToken', token, {
                maxAge: 24 *60 * 60 * 1000,
                httpOnly: true,
              })
              .status(200)
              .json({message: 'Login Successful', status: 200})
        }
      }
      catch(err) {
        console.error(err);
        res.status(500).json({error: 'something went wrong'});
      }
    })

    app.post('/logout', async (req, res) => {
      try {
        const authHeader = req.headers['cookie']; // get the session cookie from request header
        if (!authHeader) {
          return res.sendStatus(204);
        }
        res.setHeader('Clear-Site-Data', '"cookies", "storage"');
        return res.status(200).json({ message: 'You are logged out!', status: 200});
      }
      catch (err) {
        console.error(err);
        res.status(500).json({error: 'Logout failed. Please try again.'});
      }
    })

    //UPDATE
    app.put('/persons/:contactId', async(req, res) => {
      try {
        console.log(req.body);
        const { contactId: cardId } = req.params;  //destructured req.params obj. {id: personId} = req.params === personId = req.params.id
        //console.log(personId);
        // use our id param to to query DB collection for the corresponding ID
        console.log(req.body);
        const person = await db.collection('persons').findOneAndUpdate(
          { contactId: cardId },
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
    app.delete('/persons/:contactId', async (req, res) => {
      try {
        const { contactId: cardId } = req.params;  //destructured req.params obj. {id: personId} = req.params === personId = req.params.id
        //console.log(personId);
        // use our id param to to query DB collection for the corresponding ID
        const person = await db.collection('persons').deleteOne({ contactId: cardId });
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
