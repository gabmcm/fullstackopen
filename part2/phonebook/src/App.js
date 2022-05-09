import { useEffect, useState } from 'react'
import Person from './components/Person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Message from './components/Message'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setSearch] = useState('')
  const [display, setDisplay] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMessage, setError] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObj = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    let isNew = true

    persons.forEach((person) =>{
      if(JSON.stringify(personObj.name) === JSON.stringify(person.name)){
        if(JSON.stringify(personObj.number) !== JSON.stringify(person.number)) {
          if (window.confirm(`Do you want to update ${person.name}'s number?`)){
            const changedPerson = {...person, number: personObj.number}
            const id = person.id
            personService
              .update(id, changedPerson)
              .then(returnedPerson => {
                setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
              })
              .catch(error => {
                setError(
                  `${person.name} was already removed from server`
                )
                setTimeout(() => {
                  setError(null)
                }, 5000)
                setPersons(persons.filter(person => person.id !== id))
              })
          } 
        } else {
          alert(`${newName} is already added to phonebook`)
        }
        isNew = false
      } else {
        return isNew
      }
    })

    if(isNew){
      personService
        .create(personObj)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${personObj.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          isNew = true
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setDisplay(persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase())))
  }

  const peopleToShow = (newSearch.length > 0) ? display : persons

  const deletePerson = id => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Do you really want to delete ${person.name}?`)){
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(item => item.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={message}/>
      <Notification message={errorMessage} />

      <Filter newSearch={newSearch} handleSearch={handleSearch}/>
      
      <h2>add a new number</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      
      <h2>Numbers</h2>

      {peopleToShow.map(person => 
        <Person key={person.id} person={person} deletePerson={() => deletePerson(person.id)}/>
      )}
    </div>
  )
}

export default App