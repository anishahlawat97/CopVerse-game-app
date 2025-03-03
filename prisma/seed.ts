import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Deleting existing data while avoiding foreign key constraint issues
  await prisma.$transaction([
    prisma.cop.deleteMany(),
    prisma.fugitive.deleteMany(),
    prisma.gameSession.deleteMany(),
    prisma.city.deleteMany(),
    prisma.vehicle.deleteMany(),
  ])

  console.log('Existing data deleted.')

  const cities = await prisma.city.createMany({
    data: [
      { name: 'Yapkashnagar', distance: 60 },
      { name: 'Lihaspur', distance: 50 },
      { name: 'Narmis City', distance: 40 },
      { name: 'Shekharvati', distance: 30 },
      { name: 'Nuravgram', distance: 20 },
    ],
  })

  console.log(`Inserted ${cities.count} cities.`)

  const vehicles = await prisma.vehicle.createMany({
    data: [
      { type: 'EV Bike', range: 60, count: 2 },
      { type: 'EV Car', range: 100, count: 1 },
      { type: 'EV SUV', range: 120, count: 1 },
    ],
  })

  console.log(`Inserted ${vehicles.count} vehicles.`)

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error('Error while seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
