import { render, screen } from '@testing-library/react'
import CitySelection from '@/app/city-selection/page'

describe('CitySelection Page', () => {
  it('renders CitySelectionList component', () => {
    render(<CitySelection />)
    expect(screen.getByTestId('city-selection-list')).toBeInTheDocument()
  })
})
