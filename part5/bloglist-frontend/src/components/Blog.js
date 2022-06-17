import { useState } from 'react'

const Blog = ({ blog, updateBlog, user, removeBlog }) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const updateLikes = (event) => {
        event.preventDefault()
        let newLikes = blog.likes + 1
        updateBlog({
            id: blog.id,
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: newLikes
        })
    }

    const blogUser = blog.user.name

    const deleteBlog = (event) => {
        event.preventDefault()
        return window.confirm(`Remove ${blog.title} by ${blog.author}?`) ? removeBlog(blog.id) : null
    }

    return (
        <div style={blogStyle} className='blog'>
            <div>
                <p>{blog.title} - {blog.author} <button onClick={toggleVisibility} id="details">details</button></p>
            </div>
            <div style={hideWhenVisible} className='nonVis'>
                <p>{blog.url}</p>
                <p>{blog.likes} <button onClick={updateLikes} id="like-button">like</button></p>
                <p>{blog.user.name}</p>
                {blogUser === user.name ? <button onClick={deleteBlog} id="remove">remove</button> : null}
            </div>
        </div>
    )
}

export default Blog