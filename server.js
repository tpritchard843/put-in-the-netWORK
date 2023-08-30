const morgan = require('morgan')
const express = require('express')
const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

morgan.token('object', (req, res) =>  `${JSON.stringify(req.body)}`)


let phonebook = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  },
  {
    "id": 5,
    "name": "Johnny Bravo",
    "number": "86-75-3093457"
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req,res) => {
  res.send(`<p>Phonebook has info for ${phonebook.length} people</p>
  <p>${Date()}</p>`)
})

const generateId = () => {
  const maxId = phonebook.length > 0
    ? Math.max(...phonebook.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body.name)
  console.log(phonebook)

  if (!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  if (phonebook.some(person => person.name === body.name)) {
    return response.status(409).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  phonebook = phonebook.push(person)

  response.json(person)
})

app.get('/api/persons', (req, res) => {
  res.json(phonebook)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phonebook = phonebook.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = phonebook.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
