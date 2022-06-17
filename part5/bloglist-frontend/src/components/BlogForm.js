import { useState } from 'react'

const BlogForm = ({ createBlog, user }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value)
    }

    const handleAuthorChange = (event) => {
        setNewAuthor(event.target.value)
    }

    const handleUrlChange = (event) => {
        setNewUrl(event.target.value)
    }

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl,
            user: user
        })

        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
    }

    return(
        <div>
            <h2>Create a new blog</h2>

            <form onSubmit={addBlog}>
                <div>
                    title:
                    <input
                        value={newTitle}
                        onChange ={handleTitleChange}
                        id='blog-title'
                    />
                </div>
                <div>
                    author:
                    <input
                        value={newAuthor}
                        onChange ={handleAuthorChange}
                        id='blog-author'
                    />
                </div>
                <div>
                    url:
                    <input
                        value={newUrl}
                        onChange ={handleUrlChange}
                        id='blog-url'
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm