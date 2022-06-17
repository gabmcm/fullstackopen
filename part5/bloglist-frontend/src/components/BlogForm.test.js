import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    const title = container.querySelector('#blog-title')
    const author = container.querySelector('#blog-author')
    const url = container.querySelector('#blog-url')

    const sendButton = screen.getByText('create')

    await user.type(title, 'this is the title')
    await user.type(author, 'John Doe')
    await user.type(url, 'www.url.com')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
        title: 'this is the title',
        author: 'John Doe',
        url: 'www.url.com'
    })
})