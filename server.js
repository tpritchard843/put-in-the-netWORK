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
    //app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'));
    //morgan.token('object', (req, res) =>  `${JSON.stringify(req.body)}`);


    //Routes
    app.get('/', (req, res) => {
      // send index.html
      res.sendFile(__dirname + '/index.html');
    })
    app.post('/persons', (req, res) =>{
      personsCollection
        .insertOne(req.body)
        .then(result => {
          console.log(result)
          res.redirect('/');
        })
        .catch(err => console.error(err))
    })
    app.listen(PORT, () => {
      //console.log(connectionString)
      console.log(`Server running on port ${PORT}`);
    })
  })
  .catch(err => console.error(err))

// Dummy data for rolodex = [{},{},{},{}]

// let rolodex = [
//   {
//     "id": 1,
//     "name": "Arto Hellas",
//     "email": "040-123456",
//     "company": "Google",
//     "dateAdded":"2023-03-22",
//     "spark":"Likes Pokemon",
//   },
//   {
//     "id": 2,
//     "name": "Ada Lovelace",
//     "email": "39-44-5323523",
//     "company": "Apple",
//     "dateAdded":"2022-11-07",
//     "spark":"Bookworm",
//   },
//   {
//     "id": 3,
//     "name": "Dan Abramov",
//     "email": "12-43-234345",
//     "company":"Netflix",
//     "dateAdded":"2023-05-14",
//     "spark":"Cubs fan",
//   },
//   {
//     "id": 4,
//     "name": "Mary Poppendieck",
//     "email": "39-23-6423122",
//     "company": "Meta",
//     "dateAdded":"08-28-2023",
//     "spark":"Pizza lover",
//   },
//   {
//     "id": 5,
//     "name": "Johnny Bravo",
//     "email": "86-75-3093457",
//     "company": "Amazon",
//     "dateAdded":"02-14-2023",
//     "spark":"Bruce Springsteen",
//   }
// ]


// const generateId = () => {
//   const maxId = rolodex.length > 0
//     ? Math.max(...rolodex.map(n => n.id))
//     : 0;
//   return maxId + 1;
// }

app.post('/api/persons', (request, response) => {
  console.log('Helloooooooooooooo');
  // const body = request.body;
  // console.log(body.name);
  // console.log(rolodex);

  // if (!body.name) {
  //   return response.status(400).json({
  //     error: 'name is missing'
  //   })
  // }
  // if (!body.number) {
  //   return response.status(400).json({
  //     error: 'number is missing'
  //   })
  // }

  // if (rolodex.some(person => person.name === body.name)) {
  //   return response.status(409).json({
  //     error: 'name must be unique'
  //   })
  // }

  // const person = {
  //   id: generateId(),
  //   name: body.name,
  //   email: body.email,
  //   company: body.company,
  //   dateAdded: body.dateAdded
  // }

  // rolodex = rolodex.push(person);

  // response.json(person);
})

// app.get('/api/persons', (req, res) => {
//   res.json(rolodex);
// })

// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id);
//   rolodex = rolodex.filter(person => person.id !== id);

//   response.status(204).end();
// })

// app.get('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id);
//   const person = rolodex.find(person => person.id === id);

//   if (person) {
//     response.json(person);
//   } else {
//     response.status(404).end();

//   }
// })
