'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { cn } from '@/app/utils/utils'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/ui/spinner'
import { BackgroundBeams } from './ui/background-beam'

export function VehicleSelectionList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([])
  const [gameSessionId, setGameSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVehicles, setSelectedVehicles] = useState<Record<string, string>>({})
  const [vehicleUsage, setVehicleUsage] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCities = JSON.parse(sessionStorage.getItem('selectedCities') || '[]')
      const sessionId = sessionStorage.getItem('gameSessionId')

      setSelectedCityIds(storedCities)
      setGameSessionId(sessionId)
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const [vehicleRes, cityRes] = await Promise.all([
          fetch('/api/vehicles'),
          fetch('/api/cities'),
        ])

        const vehicleData = await vehicleRes.json()
        const cityData = await cityRes.json()

        setVehicles(
          vehicleData.vehicles.map((vehicle: any) => ({
            id: vehicle.id,
            type: vehicle.type,
            range: vehicle.range,
            count: vehicle.count,
            imageUrl: `/vehicles/${vehicle.type.toLowerCase().replace(/\s+/g, '-')}.jpg`,
          })),
        )

        setCities(cityData.cities)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getCityName = (cityId: string) => {
    const city = cities.find((c) => c.id === cityId)
    return city ? city.name : 'Unknown City'
  }

  const getRecommendedVehicle = (cityId: string) => {
    const city = cities.find((c) => c.id === cityId)
    if (!city) return null
    return vehicles.find((vehicle) => vehicle.range >= city.distance * 2)
  }

  const handleSelect = (copIndex: number, vehicleId: string) => {
    const cityId = selectedCityIds[copIndex]

    const vehicle = vehicles.find((v) => v.id === vehicleId)
    const city = cities.find((c) => c.id === cityId)

    if (!vehicle || !city) return

    const currentCount = vehicleUsage[vehicleId] || 0

    // Prevent selecting a vehicle if it's out of stock
    if (currentCount >= vehicle.count) {
      toast({
        title: 'Vehicle Unavailable',
        description: `Only ${vehicle.count} available.`,
        variant: 'destructive',
      })
      return
    }

    // Prevent selecting a vehicle with insufficient range for a round trip
    if (vehicle.range < city.distance * 2) {
      toast({
        title: 'Insufficient Range',
        description: `${vehicle.type} cannot complete a round trip.`,
        variant: 'destructive',
      })
      return
    }

    // Restore count for previously selected vehicle (if any)
    const previouslySelectedVehicle = selectedVehicles[cityId]
    if (previouslySelectedVehicle) {
      setVehicleUsage((prev) => ({
        ...prev,
        [previouslySelectedVehicle]: Math.max((prev[previouslySelectedVehicle] || 0) - 1, 0),
      }))
    }

    // Update the selected vehicle and decrement count
    setSelectedVehicles((prev) => ({
      ...prev,
      [cityId]: vehicleId,
    }))

    setVehicleUsage((prev) => ({
      ...prev,
      [vehicleId]: (prev[vehicleId] || 0) + 1,
    }))

    toast({
      title: `Cop ${copIndex + 1} Selected Vehicle`,
      description: `Selected ${vehicle.type} for ${getCityName(cityId)}`,
    })
  }

  const handleSubmit = async () => {
    if (!gameSessionId) {
      toast({
        title: 'Game Session Error',
        description: 'Game session ID is missing.',
        variant: 'destructive',
      })
      return
    }

    if (Object.keys(selectedVehicles).length !== selectedCityIds.length) {
      toast({
        title: 'Selection Incomplete',
        description: 'All cops must select a vehicle.',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)

    const copSelections = selectedCityIds.map((cityId: string | number, index: number) => ({
      copName: `Cop ${index + 1}`,
      cityId,
      vehicleId: selectedVehicles[cityId],
    }))

    try {
      const res = await fetch('/api/cop-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameSessionId, cops: copSelections }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        toast({
          title: 'Submission Failed',
          description: responseData.error || 'Something went wrong.',
          variant: 'destructive',
        })
        throw new Error('Failed to submit selection')
      }

      router.push('/result')
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen text-center animate-fade-in">
      <h2 className="text-4xl font-bold mb-8 animate-fade-in">Select Vehicles for Each Cop</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-64 h-64" />
          ))}
        </div>
      ) : (
        <div className="max-w-6xl w-full">
          {selectedCityIds.map((cityId: string, index: number) => {
            const recommendedVehicle = getRecommendedVehicle(cityId)

            return (
              <div key={cityId} className="mb-10">
                <h3 className="text-xl font-semibold mb-2">
                  Cop {index + 1} - {getCityName(cityId)}
                </h3>
                {recommendedVehicle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Recommended: <b>{recommendedVehicle.type}</b> (Sufficient Range)
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => {
                    const isSelected = selectedVehicles[cityId] === vehicle.id
                    const isUnavailable = (vehicleUsage[vehicle.id] || 0) >= vehicle.count
                    const isInsufficientRange =
                      vehicle.range < (cities.find((c) => c.id === cityId)?.distance ?? 0) * 2

                    return (
                      <div
                        key={vehicle.id}
                        onClick={() => handleSelect(index, vehicle.id)}
                        className={cn(
                          'relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-64 w-full transition-all duration-300 ease-out cursor-pointer rounded-xl shadow-lg',
                          isSelected
                            ? 'border-4 border-emerald-500 scale-105'
                            : 'blur-sm hover:blur-none',
                          isUnavailable || isInsufficientRange
                            ? 'opacity-50 cursor-not-allowed'
                            : '',
                        )}
                      >
                        <Image
                          src={vehicle.imageUrl}
                          alt={vehicle.type}
                          fill
                          className="object-cover absolute inset-0"
                        />

                        <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                          {vehicle.count - (vehicleUsage[vehicle.id] || 0)} Available
                        </div>

                        <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-lg shadow-md">
                          🔋 {vehicle.range} KM
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-3 bg-emerald-500 text-white rounded-lg"
      >
        {submitting ? <Spinner /> : 'Submit'}
      </button>
    </div>
  )
}
