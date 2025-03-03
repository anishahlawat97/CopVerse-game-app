import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prismaClient'

export async function GET() {
  try {
    const cities = await prisma.city.findMany()

    return NextResponse.json({
      success: true,
      cities: cities.map(({ id, name, distance }) => ({
        id,
        name,
        distance,
      })),
    })
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cities. Please try again.' },
      { status: 500 },
    )
  }
}
