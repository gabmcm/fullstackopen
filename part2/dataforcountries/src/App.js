import {useEffect, useState} from 'react'
import Countries from './components/Countries'
import Details from './components/Details'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [newSearch, setSearch] = useState('')
  const [display, setDisplay] = useState([])

 
  const hook = () => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }

  useEffect(hook, [])

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setDisplay(countries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase())))
  }

  const displayDetails = (key) => {
    setSearch('')
    setDisplay([key])    
  }

  if(display.length > 10){
    return (
      <div>
        find countries <input value={newSearch} onChange={handleSearch} />
        <br />
        <span>Too many matches, specify another filter</span>
      </div>
    )
  } else if(display.length === 1){
    return (
      <div>
        find countries <input value={newSearch} onChange={handleSearch} />
        <Details display={display[0]}/>
      </div>
    )
  } else {
    return (
      <div>
        find countries <input value={newSearch} onChange={handleSearch} />
        <br />
        {display.map(country => {
        return(
          <div key={country.name.common}>
            <Countries country={country} displayDetails={displayDetails}/>
            <button onClick={() => displayDetails(country)}>show</button>
          </div>
        )
        })}
      </div>
    )
  }
  
  
}

export default App
