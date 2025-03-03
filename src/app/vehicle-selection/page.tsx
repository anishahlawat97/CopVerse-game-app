'use client'

import { BackgroundBeams } from '@/components/ui/background-beam'
import VehicleSelectionList from '@/components/VehicleSelectionList'

export default function VehicleSelection() {
  return (
    <>
      <BackgroundBeams />
      <VehicleSelectionList data-testid="vehicle-selection-list" />
    </>
  )
}
