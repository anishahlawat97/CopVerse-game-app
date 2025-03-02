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

    // Define the type of accumulator (vehicleUsageMap)
    const vehicleUsageMap: Record<string, number> = vehicleUsage.reduce(
      (
        acc: Record<string, number>,
        usage: { vehicleId: string; _count: { vehicleId: number } },
      ) => {
        acc[usage.vehicleId] = usage._count.vehicleId
        return acc
      },
      {}, // Initial empty object
    )

    // Adjust available vehicle counts based on selections
    const updatedVehicles = vehicles.map((vehicle: Vehicle) => ({
      ...vehicle,
      availableCount: Math.max(vehicle.count - (vehicleUsageMap[vehicle.id] || 0), 0),
    }))

    return NextResponse.json({ success: true, vehicles: updatedVehicles })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch vehicles' }, { status: 500 })
  }
}
