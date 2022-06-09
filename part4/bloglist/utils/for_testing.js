/* eslint-disable indent */
const totalLikes = (blogs) => {
    let total = 0

    blogs.forEach((blog) => {
        return total += blog.likes
    })

    return total
}

const favoriteBlog = (blogs) => {
    blogs.sort((a, b) => b.likes - a.likes)

    return {
        title: blogs[0].title,
        author: blogs[0].author,
        likes: blogs[0].likes
    }
}

const mostBlogs = (blogs) => {
    let authors = []

    blogs.forEach((blog) => {
        authors.push(blog.author)
    })

    let bestAuthor = authors.slice().sort((a,b) =>
        authors.filter(v => v===a).length
        - authors.filter(v => v===b).length
    ).pop()

    return {
        author: bestAuthor,
        blogs: authors.filter(x => x===bestAuthor).length
    }
}

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs
}