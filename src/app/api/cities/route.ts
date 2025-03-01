import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prismaClient'

export async function GET() {
  const cities = await prisma.city.findMany()
  return NextResponse.json({ success: true, cities })
}
