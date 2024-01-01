const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

morgan.token('postBody', (req) => {
    if (req.method==='POST') {
        return(JSON.stringify(req.body))
    }
})
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))

let persons = [
    {
        'id':1,
        'name':'Arto Hellas',
        'number':'040-123456'
    },
    {
        'id':2,
        'name':'Ada Lovelace',
        'number':'39-44-5323523'
    },
    {
        'id':3,
        'name':'Dan Abramov',
        'number':'12-43-234345'
    },
    {
        'id':4,
        'name':'Mary Poppendick',
        'number':'39-23-6423122'
    }
]

const generateId = () =>  Math.floor(Math.random() * 1000000)

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => id === person.id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => id != person.id)

    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
            error: 'name cannot be empty' 
          })
    }

    if (!body.number) {
        return response.status(400).json({ 
            error: 'number cannot be empty' 
          })
    }

    if (persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    body.id = generateId()
    persons = persons.concat(body)
    
    response.json(body)
  })

app.get('/info', (request, response) => {
    const now = new Date()
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${now}</p>`
        )
}
)

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})