import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prismaClient'

export async function POST() {
  try {
    console.log('Starting a new game session...')

    // Clear previous game session data
    await prisma.cop.deleteMany()
    await prisma.fugitive.deleteMany()

    // Get all available cities
    const cities = await prisma.city.findMany()
    if (cities.length === 0) {
      return NextResponse.json({ success: false, error: 'No cities available' }, { status: 400 })
    }

    // Randomly assign fugitive to a city
    const randomCity = cities[Math.floor(Math.random() * cities.length)]
    const fugitive = await prisma.fugitive.create({
      data: {
        cityId: randomCity.id,
      },
    })

    console.log(`Fugitive placed in: ${randomCity.name}`)
    return NextResponse.json({ success: true, message: 'Game started', fugitiveCity: randomCity.name })
  } catch (error) {
    console.error('Error starting game:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
