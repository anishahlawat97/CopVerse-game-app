'use client'

import { useState, useEffect } from 'react'
import ResultSection from '@/components/ResultSection'
import { WorldMap } from '@/components/ui/world-map'
import { worldMapData } from '@/data/data'

export default function ResultPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 5000) // Show world map for 5 seconds
  }, [])

  return loading ? (
    <div className="flex justify-center items-center min-h-screen">
      <WorldMap dots={worldMapData} />
    </div>
  ) : (
    <ResultSection />
  )
}
