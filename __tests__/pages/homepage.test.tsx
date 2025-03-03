import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('HomePage', () => {
  it('renders HeroSection component', () => {
    render(<HomePage />)
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
  })
})
