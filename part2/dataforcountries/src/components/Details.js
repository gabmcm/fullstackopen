// import Information from './Information'
import Language from './Language'
import {useEffect, useState} from 'react'
import axios from 'axios'

const Details = ({display}) => {
    const [weather, setWeather] = useState({})
    const api_key = process.env.REACT_APP_API_KEY

    useEffect(() => { 
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${display.capital[0]}&appid=${api_key}&units=metric`)
          .then(response => {
                setWeather(response.data)
          })
          return () => setWeather({})
        }, [])

        console.log(weather)


    return (
        <div>
            <h1>{display.name.common}</h1>

            <p>capital {display.capital[0]}</p>
            <p>area {display.area}</p>

            <h2>languages:</h2>
            <ul>
            {Object.values(display.languages).map(val =>
                <Language key={val} language={val} />
            )}
            </ul>

            <img src={display.flags.png} alt="flag" />

            <h2>Weather in {display.name.common}</h2>
            {Object.keys(weather).length !== 0 &&(
                <>
                    <p>temperature {weather.main.temp} Celsius</p>
                    <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt='weather icon'/>
                    <p>wind {weather.wind.speed} m/s</p>
                </>
                
            )}
        </div>  
    )
    
}

export default Details


