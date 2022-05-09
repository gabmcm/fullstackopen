const Person = ({person, deletePerson}) => {
  return (
    <span>{person.name} {person.number} <button onClick={deletePerson}>delete</button><br/ ></span>
  )
}

export default Person