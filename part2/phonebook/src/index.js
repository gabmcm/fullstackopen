import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import './index.css'

import App from './App'

axios.get('/api/persons').then(response => {
  const persons = response.data
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App persons={persons}/>
  )
})
