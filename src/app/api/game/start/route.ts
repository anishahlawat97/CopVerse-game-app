import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prismaClient'

export async function POST() {
  try {
    console.log('Starting a new game session...')

    // Clear previous game session data
    await prisma.cop.deleteMany()
    await prisma.fugitive.deleteMany()
    await prisma.gameSession.deleteMany()

    // Get all available cities
    const cities = await prisma.city.findMany()
    if (cities.length === 0) {
      return NextResponse.json({ success: false, error: 'No cities available' }, { status: 400 })
    }

    // Create new game session
    const newGameSession = await prisma.gameSession.create({
      data: {
        fugitiveCityId: cities[Math.floor(Math.random() * cities.length)].id,
        createdAt: new Date(),
      },
    })

    // Assign fugitive to a random city within this game session
    const fugitive = await prisma.fugitive.create({
      data: {
        cityId: newGameSession.fugitiveCityId,
        gameSessionId: newGameSession.id,
      },
    })

    console.log(`Fugitive placed in: ${fugitive.cityId}`)
    return NextResponse.json({
      success: true,
      message: 'Game started',
      gameSessionId: newGameSession.id,
      fugitiveCity: fugitive.cityId,
    })
  } catch (error) {
    console.error('Error starting game:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
