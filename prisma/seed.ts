import { prisma } from '../src/lib/prismaClient.js'

async function main() {
  console.log('Seeding database...')

  const cities = [
    { name: 'Yapkashnagar', distance: 60 },
    { name: 'Lihaspur', distance: 50 },
    { name: 'Narmis City', distance: 40 },
    { name: 'Shekharvati', distance: 30 },
    { name: 'Nuravgram', distance: 20 },
  ]

  const vehicles = [
    { type: 'EV Bike', range: 60, count: 2 },
    { type: 'EV Car', range: 100, count: 1 },
    { type: 'EV SUV', range: 120, count: 1 },
  ]

  await prisma.city.deleteMany()
  await prisma.vehicle.deleteMany()

  await prisma.city.createMany({ data: cities })
  await prisma.vehicle.createMany({ data: vehicles })

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
