import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
    let container
    const user = {
        username: 'johnsmith',
        name: 'John Smith',
        password: 'supersecure'
    }

    const blog ={
        title: 'Sample title',
        author: 'John Smith',
        url: 'www.url.com',
        likes: 2,
        user: user.name
    }

    const mockHandler = jest.fn()

    beforeEach(() => {
        container = render(
            <Blog blog={blog} user={user} updateBlog={mockHandler}>
            </Blog>
        ).container
    })

    test('renders author and title', () => {
        const div = container.querySelector('.nonVis')
        expect(div).toHaveStyle('display: none')
    })

    test('after clicking the button, children are display', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('details')
        await user.click(button)

        const div = container.querySelector('.nonVis')
        expect(div).not.toHaveStyle('display: none')
    })

    test('clicking the like button twice calls the event handler twice', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('like')
        await user.click(button)
        await user.click(button)

        expect(mockHandler.mock.calls).toHaveLength(2)
    })
})