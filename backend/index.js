require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


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

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
  })

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
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

    const person = new Person ({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
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