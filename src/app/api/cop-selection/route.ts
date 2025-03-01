import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prismaClient'
import { z } from 'zod'

// Validation Schema
const CopSelectionSchema = z.object({
  copName: z.string().min(1, 'Cop name is required'),
  cityId: z.string().min(1, 'City selection is required'),
  vehicleId: z.string().min(1, 'Vehicle selection is required'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsedData = CopSelectionSchema.safeParse(body)

    if (!parsedData.success) {
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    const { copName, cityId, vehicleId } = parsedData.data

    // Get city and vehicle details
    const city = await prisma.city.findUnique({ where: { id: cityId } })
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } })

    if (!city || !vehicle) {
      return NextResponse.json({ success: false, error: 'Invalid city or vehicle selection' }, { status: 400 })
    }

    // Check if vehicle has enough range for a round trip
    if (vehicle.range < city.distance * 2) {
      return NextResponse.json({ success: false, error: 'Vehicle range is insufficient for a round trip' }, { status: 400 })
    }

    // Check if city is already selected by another cop
    const existingSelection = await prisma.cop.findFirst({ where: { cityId } })
    if (existingSelection) {
      return NextResponse.json({ success: false, error: 'City is already selected by another cop' }, { status: 400 })
    }

    // Check vehicle availability
    const vehicleUsageCount = await prisma.cop.count({ where: { vehicleId } })

    if (vehicleUsageCount >= vehicle.count) {
      return NextResponse.json({ success: false, error: 'Vehicle is no longer available' }, { status: 400 })
    }

    // Save cop selection
    const cop = await prisma.cop.create({
      data: {
        name: copName,
        cityId,
        vehicleId,
      },
    })

    return NextResponse.json({ success: true, cop })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
