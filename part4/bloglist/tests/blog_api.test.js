const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const bcrypt = require('bcryptjs')

const User = require('../models/user')
const Blog = require('../models/blog')

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukainen',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
})

describe('returning blogs correctly ', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })
	
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
	
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
	
    test('notes are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }, 100000)

    test('unique identifier is called id', async () => {
        const response = await api.get('/api/blogs')
	
        const blogs = response.body
		
        expect(blogs[0]._id).toBeDefined()
    })
})

describe('creating new blogs', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('making a POST request successfully creates a new post', async () => {
        const newBlog = {
            title: 'Type wars',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
            likes: 2,
        }
		
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
	
        const blogsAfterUpdate = await helper.blogsInDb()
	
        expect(blogsAfterUpdate).toHaveLength(helper.initialBlogs.length + 1)
    })
	
    test('blogs without likes defaults to 0', async () => {
        const newBlog = {
            title: 'Type wars',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        }
		
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
	
        const blogs = await helper.blogsInDb()
	
        helper.initialBlogs.forEach(blog => {
            if(!blog.likes){
                blog.likes = 0
            }
        })
	
        const dbLikes = blogs.map(blog => blog = blog.likes).filter(like => typeof like !== 'undefined')
        const oldLikes = helper.initialBlogs.map(blog => blog = blog.likes)
        expect(dbLikes).toHaveLength(oldLikes.length + 1)
    })
	
    test('blogs without a title and url cannot be posted', async () => {
        const newBlog = {
            author: 'John Doe',
            likes: 1
        }
	
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
	
        const blogsAtEnd = await helper.blogsInDb()
	
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
	
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
	
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
	
        const blogsAtEnd = await helper.blogsInDb()
	
        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )
	
        const titles = blogsAtEnd.map(r => r.title)
	
        expect(titles).not.toContain(blogToDelete.title)
    })
	
    test('likes for a blog post can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        let blogToUpdate = blogsAtStart.find(blog => blog.title === 'React patterns')
	
        blogToUpdate.likes = 12
	
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(201)
	
		
        let originalLikes = blogsAtStart.map(r => r.likes)
        const blogsAtEnd = await helper.blogsInDb()
        let updatedLikes = blogsAtEnd.map(r => r.likes)
	
        console.log(originalLikes)
        console.log(updatedLikes)
        expect(updatedLikes.reduce((a,b) => a + b,0)).toEqual((originalLikes.reduce((a,b) => a + b, 0)))
    })
})

afterAll(() => {
    mongoose.connection.close()
})