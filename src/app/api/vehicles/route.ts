import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prismaClient'

export async function GET() {
  const vehicles = await prisma.vehicle.findMany()
  return NextResponse.json({ success: true, vehicles })
}
