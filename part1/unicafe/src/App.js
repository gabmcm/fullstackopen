import { useState } from 'react'

const Statistics = (props) => {
  if (props.good === 0 && props.bad === 0 && props.neutral === 0){
    return (
      <>
      <h1>statistics</h1>
      <h2>No feedback given</h2>
      </>
    )
  }

  let good = props.good
  let neutral = props.neutral
  let bad = props.bad

  return (
    <>
      <h1>statistics</h1>
        <table>
          <tbody>
            <tr>
              <StatisticLine text="good" value={good}/>
            </tr>
            <tr>
              <StatisticLine text="neutral" value={neutral}/>
            </tr>
            <tr>
              <StatisticLine text="bad" value={bad}/>
            </tr>
            <tr>
              <StatisticLine text="all" value={good + neutral + bad}/>
            </tr>
            <tr>
              <StatisticLine text="average" value={((good - bad)/(good + bad + neutral)) || 0}/>
            </tr>
            <tr>
              <StatisticLine text="positive" value={((good/(good + bad + neutral)) * 100) || 0}/>
            </tr>
          </tbody>
        </table>
        
    </>
  )
}

const Button = (props) => {
  return (
    <>
      <button onClick={() => props.setName(props.name + 1)}>{props.text}</button>
    </>
  )

}

const StatisticLine = (props) => {
  if (props.text === "positive"){
    return(
      <>
        <td>{props.text}</td>
        <td>{props.value}%</td>
      </>
    )
  }

  return(
    <>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </>
  )
  

}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button name = {good} setName = {setGood} text = 'Good'/>
      <Button name = {neutral} setName = {setNeutral} text='Neutral'/>
      <Button name = {bad} setName = {setBad} text='Bad'/>

      <Statistics good = {good} bad = {bad} neutral = {neutral}/>
    </div>
  )
}

export default App