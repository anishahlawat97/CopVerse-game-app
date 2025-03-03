import { render, screen } from '@testing-library/react'
import VehicleSelection from '@/app/vehicle-selection/page'

describe('VehicleSelection Page', () => {
  it('renders VehicleSelectionList components', () => {
    render(<VehicleSelection />)

    expect(screen.getByTestId('vehicle-selection-list')).toBeInTheDocument()
  })
})
