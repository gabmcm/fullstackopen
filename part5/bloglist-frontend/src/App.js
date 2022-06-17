import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/Login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [allBlogs, setAllBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    //Login form with toggle button
    const loginForm = () => {
        return (
            <Togglable buttonLabel='login'>
                <LoginForm
                    username={username}
                    password={password}
                    handleUsernameChange={({ target }) => setUsername(target.value)}
                    handlePasswordChange={({ target }) => setPassword(target.value)}
                    handleSubmit={handleLogin}
                />
            </Togglable>
        )
    }

    // Fetch all blogs once user is logged in
    useEffect(() => {
        if(user){
            blogService.getAll().then(initialBlogs => {setAllBlogs(initialBlogs)})
        }
    }, [user])

    // On page load, check if there is a user in localStorage
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if(loggedUserJSON){
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    //Logging in functionality, stores user in localStorage, displays appropriate error/success message on log in
    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({
                username, password,
            })
            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
            setSuccessMessage(`${user.name} has successfully logged in`)
            setTimeout(() => {
                setSuccessMessage(null)
            }, 5000)
        } catch (exception) {
            setErrorMessage('Wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const handleLogout = async (event) => {
        event.preventDefault()
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
    }

    const blogFormRef = useRef()

    const addBlog = (blogObject) => {
        blogFormRef.current.toggleVisibility()
        blogService
            .createBlog(blogObject)
            .then(returnedBlog => {
                console.log(returnedBlog)
                setAllBlogs(allBlogs.concat(returnedBlog))
                setSuccessMessage(`${returnedBlog.title} by ${returnedBlog.author} successfully added`)
                setTimeout(() => {
                    setSuccessMessage(null)
                }, 5000)
            })
            .catch((error) => {
                setErrorMessage(`Something went wrong: ${error}`)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
            })
    }

    const updateBlog = (blogObject) => {
        const blog = allBlogs.find(n => n.id === blogObject.id)
        const updatedBlog = { ...blog, likes: blogObject.likes }

        blogService
            .update(blogObject.id, updatedBlog)
            .then(returnedBlog => {
                setAllBlogs(allBlogs.map(blog => blog.id !== blogObject.id ? blog : { ...returnedBlog, user: updatedBlog.user }))
                setSuccessMessage(`${returnedBlog.title} by ${returnedBlog.author} updated successfully`)
                setTimeout(() => {
                    setSuccessMessage(null)
                }, 5000)
            })
            .catch((error) => {
                setErrorMessage(`Something went wrong: ${error}`)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
            })
    }

    const removeBlog = (id) => {
        blogService
            .remove(id)
            .then(
                setAllBlogs(allBlogs.filter(n => n.id !== id))
            )
    }

    const blogForm = () => (
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} user={user} />
        </Togglable>
    )

    return (
        <div>
            <h1>blogs</h1>

            <Notification errorMessage={errorMessage} successMessage={successMessage} />

            {user === null ?
                loginForm()
                :
                <div>
                    <p>{user.name} is logged in  <button onClick={handleLogout}>logout</button></p>
                    <br />

                    {blogForm()}

                    <br />

                    {allBlogs
                        .sort((a,b) => b.likes - a.likes)
                        .map(blog =>
                            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} user={user} removeBlog={removeBlog}/>)
                    }
                </div>
            }
        </div>
    )
}

export default App
