
import App from './app'
import { useQuery } from '@tanstack/react-query'

import { render, screen } from '../test-utils'

jest.mock('@tanstack/react-query')

describe('App', () => {
  it.skip('renders loading state initially', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      data: null,
      error: null,
    })

    render(<App />)
    expect(screen.getByText(/loading/i)).toBeTruthy()
  })

  it.skip('renders error state when there is an error', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: null,
      error: new Error('Something went wrong'),
    })

    render(<App />)
    expect(await screen.findByText(/error/i)).toBeTruthy()
  })

  it.skip('renders data when fetched successfully', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { name: 'John Doe' },
      error: null,
    })

    render(<App />)
    expect(await screen.findByText(/data:/i)).toBeTruthy()
    expect(screen.getByText(/"name":"John Doe"/i)).toBeTruthy()
  })
})
