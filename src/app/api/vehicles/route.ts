import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prismaClient'

export async function GET() {
  try {
    // Fetch all vehicles from the database
    const vehicles = await prisma.vehicle.findMany()

    // Fetch the count of each vehicle type already selected by cops
    const vehicleUsage = await prisma.cop.groupBy({
      by: ['vehicleId'],
      _count: { vehicleId: true },
    })

    // Convert vehicleUsage array to a map for quick lookup
    const vehicleUsageMap: Record<string, number> = vehicleUsage.reduce(
      (
        acc: { [x: string]: number },
        { vehicleId, _count }: { vehicleId: string; _count: { vehicleId: number } },
      ) => {
        acc[vehicleId] = _count.vehicleId
        return acc
      },
      {} as Record<string, number>,
    )

    // Adjust available vehicle counts based on selections
    const updatedVehicles = vehicles.map(
      ({ id, type, range, count }: { id: string; type: string; range: number; count: number }) => ({
        id,
        type,
        range,
        count,
        availableCount: Math.max(count - (vehicleUsageMap[id] || 0), 0),
      }),
    )

    return NextResponse.json({ success: true, vehicles: updatedVehicles })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles. Please try again.' },
      { status: 500 },
    )
  }
}
