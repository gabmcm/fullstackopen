//Phonebook app back-end

/* eslint-disable no-unused-vars */
require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const res = require('express/lib/response')

app.use(cors())

app.use(express.json())

app.use(express.static('build'))

morgan.token('content', function(req) {return JSON.stringify(req.body)})

app.use(morgan(':method :url :status :response-time :content'))

app.get('/', (request, response) =>{
	response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) =>{
	Person.find({}).then(persons => {
		response.json(persons)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if(person){
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.get('/info', (request, response) =>{
	let date = new Date
	Person.find({}).then(persons => {
		response.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${date}</p>
        `)
	})
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) =>{
	const body = request.body

	const person = {
		name: body.name,
		number: body.number,
	}

	Person.findOneAndUpdate({name: body.name}, person, 
		{runValidators: true,
			context: 'query' },
		function(err){
			if(err){ 
				return next(err)
			}
			response.json(person)
		})
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	if (!body.name || !body.number){
		return response.status(400).json({
			error: 'content missing'
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person.save()
		.then(savedPerson => {
			response.json(savedPerson)
		})
		.catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if(error.name === 'CastError'){
		return response.status(400).send({error: 'malformatted id'})
	} else if (error.name === 'ValidationError'){
		return response.status(400).send({ error: error.message })
	} else if (error.name === 'ValidatorError'){
		return response.status(400).send({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
}) 