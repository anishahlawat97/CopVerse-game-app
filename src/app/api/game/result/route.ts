import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prismaClient'
import { z } from 'zod'

// Validation Schema
const GameSessionSchema = z.object({
  gameSessionId: z.string().min(1, 'Game session ID is required'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsedData = GameSessionSchema.safeParse(body)

    if (!parsedData.success) {
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    const { gameSessionId } = parsedData.data

    console.log('Checking game result for session:', gameSessionId)

    // Fetch fugitive's location for the given game session
    const fugitive = await prisma.fugitive.findFirst({
      where: { gameSessionId },
    })

    if (!fugitive) {
      return NextResponse.json(
        { success: false, error: 'Game session not started or invalid' },
        { status: 400 },
      )
    }

    // Find cops who selected the fugitive’s city
    const winningCops = await prisma.cop.findMany({
      where: { cityId: fugitive.cityId, gameSessionId },
    })

    let resultMessage = '🚨 The fugitive escaped! No cop found them.'
    let winners = null

    if (winningCops.length > 0) {
      resultMessage = `🚔 The fugitive was captured by ${winningCops
        .map((c) => c.name)
        .join(', ')}! 🎉`
      winners = winningCops.map((c) => ({
        name: c.name,
        cityId: c.cityId,
      }))
    }

    // Only clear data related to this game session
    await prisma.cop.deleteMany({ where: { gameSessionId } })
    await prisma.fugitive.deleteMany({ where: { gameSessionId } })

    console.log(resultMessage)
    return NextResponse.json({ success: true, message: resultMessage, winners })
  } catch (error) {
    console.error('Error determining result:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
