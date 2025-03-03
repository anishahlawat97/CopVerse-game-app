'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import DotPattern from '@/components/magicui/dot-pattern'
import { cn } from '@/app/utils/utils'
import Image from 'next/image'

interface CitySelectionListProps {
  'data-testid'?: string
}

const CitySelectionList: React.FC<CitySelectionListProps> = ({ 'data-testid': testId }) => {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCities, setSelectedCities] = useState<string[]>([]) // Multiple city selection
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch('/api/cities')
        const data = await res.json()
        setCities(
          data.cities.map((city: any) => ({
            id: city.id,
            name: city.name,
            distance: city.distance, // Fetch distance from API
            imageUrl: `/cities/${city.name.toLowerCase().replace(/\s+/g, '-')}.png`,
          })),
        )
      } catch (error) {
        console.error('Failed to fetch cities:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCities()
  }, [])

  const handleSelect = (cityId: string) => {
    setSelectedCities((prevSelected) => {
      if (prevSelected.includes(cityId)) {
        const newSelection = prevSelected.filter((id) => id !== cityId)
        toast({
          title: 'City Deselected',
          description: 'You can choose another city.',
        })
        return newSelection
      }

      if (prevSelected.length >= 3) {
        toast({
          title: 'Limit Reached',
          description: 'You can select up to 3 cities.',
          variant: 'destructive',
        })
        return prevSelected // Prevent more than 3 selections
      }

      toast({
        title: 'City Selected',
        description: 'Proceed to vehicle selection.',
      })
      return [...prevSelected, cityId]
    })
  }

  const handleNext = () => {
    sessionStorage.setItem('selectedCities', JSON.stringify(selectedCities))
    router.push('/vehicle-selection')
  }

  return (
    <div
      data-testid={testId}
      className="flex flex-col items-center justify-center min-h-screen text-center p-6"
    >
      {/* Background Dot Pattern */}
      <DotPattern
        glow={true}
        className={cn('[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]')}
      />

      {/* Title */}
      <h2 className="text-4xl font-bold mb-8 animate-fade-in">Select Up to 3 Cities</h2>

      {/* City Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
        {loading
          ? [...Array(6)].map((_, i) => <Skeleton key={i} className="w-64 h-64 rounded-lg" />)
          : cities.map((city) => (
              <CardContainer key={city.id} className="inter-var">
                <CardBody
                  className={`bg-gray-50 dark:bg-black dark:border-white/[0.2] border border-black/[0.1] 
                      w-auto sm:w-[20rem] h-auto rounded-xl p-6 cursor-pointer transition-all 
                      hover:scale-105 hover:shadow-lg dark:hover:shadow-emerald-500/[0.2] 
                      ${selectedCities.includes(city.id) ? 'border-2 border-emerald-500' : ''}`}
                >
                  {/* City Name */}
                  <CardItem
                    translateZ={50}
                    className="text-xl font-bold text-neutral-600 dark:text-white"
                  >
                    {city.name}
                  </CardItem>

                  {/* Distance from current location */}
                  <CardItem
                    translateZ={40}
                    className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                  >
                    📍 {city.distance} KM away
                  </CardItem>

                  {/* City Image */}
                  <CardItem translateZ={100} className="w-full mt-4">
                    <Image
                      src={city.imageUrl ?? ''}
                      alt={city.name}
                      width={200}
                      height={200}
                      className="h-48 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                    />
                  </CardItem>

                  {/* Selection Indicator */}
                  <div className="flex justify-center mt-6">
                    <CardItem
                      translateZ={20}
                      as="button"
                      onClick={() => handleSelect(city.id)}
                      className={`px-4 py-2 rounded-xl text-lg font-semibold transition hover:scale-110 flex items-center gap-2
                        ${
                          selectedCities.includes(city.id)
                            ? 'border-2 border-emerald-500 text-emerald-500 bg-transparent'
                            : 'bg-black dark:bg-white dark:text-black text-white'
                        }`}
                    >
                      {selectedCities.includes(city.id) ? 'Selected' : 'Select'}
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center mt-10 w-full max-w-lg space-x-4">
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold transition hover:scale-105 flex items-center gap-2"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={selectedCities.length === 0}
          className={`px-6 py-3 rounded-lg font-semibold transition hover:scale-105 flex items-center gap-2
            ${selectedCities.length > 0 ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-gray-300 cursor-not-allowed'}`}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default CitySelectionList
