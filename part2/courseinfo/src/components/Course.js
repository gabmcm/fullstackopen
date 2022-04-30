const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => 
  <p>
    Number of exercises {sum}
  </p>

const Part = ({ name, exercises }) => 
  <p>
    {name} {exercises}
  </p>

const Content = ({ parts }) =>
    <>
      {parts.map(part => <Part key = {part.id} name = {part.name} exercises = {part.exercises}/>)}
    </>


const Course = ({course}) => 
  <>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total sum={course.parts.map(part => part = part.exercises).reduce((a,b) => a + b, 0)}/>
  </>

export default Course