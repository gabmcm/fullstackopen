import { updateVote } from '../reducers/anecdoteReducer'
import { notificationUpdate } from '../reducers/notificationReducer'
import { useSelector, useDispatch } from 'react-redux'

const Anecdote = ({anecdote}) => {
    const dispatch = useDispatch()

    const handleVote = () => {
        dispatch(updateVote(anecdote))
        dispatch(notificationUpdate(`"${anecdote.content}" was given +1 vote`, 3))
    }

    return (
        <div>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleVote}>vote</button>
            </div>
        </div>     
    )
}

const AnecdoteList = () => {
    const anecdotes = useSelector(({ filter, anecdotes }) => {
        if ( filter === null ) {
            return anecdotes
        }
        const regex = new RegExp( filter, 'i' )
        return anecdotes.filter(anecdote => anecdote.content.match(regex))
    })

    const sortVotes = (b1, b2) => b2.votes - b1.votes

    return(
        anecdotes.slice().sort(sortVotes).map(anecdote => <Anecdote key={anecdote.id} anecdote={anecdote} />)
    )
}
export default AnecdoteList