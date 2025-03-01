import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prismaClient'

export async function GET() {
  try {
    const cops = await prisma.cop.findMany({
      include: {
        city: true,
        vehicle: true,
      },
    })

    return NextResponse.json({ success: true, cops })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch cop selections' }, { status: 500 })
  }
}
