import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prismaClient'

export async function GET() {
  try {
    console.log('Checking game result...')

    // Get fugitive's location
    const fugitive = await prisma.fugitive.findFirst()
    if (!fugitive) {
      return NextResponse.json({ success: false, error: 'Game session not started' }, { status: 400 })
    }

    // Check if any cop selected the fugitive's city
    const winningCop = await prisma.cop.findFirst({ where: { cityId: fugitive.cityId } })

    let resultMessage = 'Fugitive escaped! No cop found them.'
    let winner = null

    if (winningCop) {
      resultMessage = `🚔 ${winningCop.name} captured the fugitive! 🎉`
      winner = winningCop.name
    }

    // Reset the game session after declaring the winner
    await prisma.cop.deleteMany()
    await prisma.fugitive.deleteMany()

    console.log(resultMessage)
    return NextResponse.json({ success: true, message: resultMessage, winner })
  } catch (error) {
    console.error('Error determining result:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
