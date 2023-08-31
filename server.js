const morgan = require('morgan');
const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'));
morgan.token('object', (req, res) =>  `${JSON.stringify(req.body)}`);

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

app.get('/', (req, res) => {
  // send index.html
  res.send('<h1>Hello World!</h1>');
})

app.get('/info', (req,res) => {
  res.send(`<p>Phonebook has info for ${phonebook.length} people</p>
  <p>${Date()}</p>`);
})

const generateId = () => {
  const maxId = rolodex.length > 0
    ? Math.max(...rolodex.map(n => n.id))
    : 0;
  return maxId + 1;
}

app.post('/api/persons', (request, response) => {
  console.log('Helloooooooooooooo')
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

app.get('/api/persons', (req, res) => {
  res.json(rolodex);
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  rolodex = rolodex.filter(person => person.id !== id);

  response.status(204).end();
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = rolodex.find(person => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();

  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
