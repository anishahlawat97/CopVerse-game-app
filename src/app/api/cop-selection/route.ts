import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { z } from "zod";
import { ObjectId } from "bson";

// Validation Schema for selecting multiple cops at once
const CopSelectionSchema = z.array(
  z.object({
    copName: z.string().min(1, "Cop name is required"),
    cityId: z.string().min(1, "City selection is required"),
    vehicleId: z.string().min(1, "Vehicle selection is required"),
  })
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = CopSelectionSchema.safeParse(body.cops);

    if (!parsedData.success) {
      return NextResponse.json(
        { success: false, error: parsedData.error.errors },
        { status: 400 }
      );
    }

    const { gameSessionId } = body;

    if (!gameSessionId) {
      return NextResponse.json(
        { success: false, error: "Game session ID is missing" },
        { status: 400 }
      );
    }

    const sessionObjectId = new ObjectId(gameSessionId);

    // Fetch all selected cities and vehicles
    const cityIds = parsedData.data.map((c) => c.cityId);
    const vehicleIds = parsedData.data.map((v) => v.vehicleId);

    const cities = await prisma.city.findMany({ where: { id: { in: cityIds } } });
    const vehicles = await prisma.vehicle.findMany({ where: { id: { in: vehicleIds } } });

    // if (cities.length !== cityIds.length || vehicles.length !== vehicleIds.length) {
    //   return NextResponse.json(
    //     { success: false, error: "Invalid city or vehicle selection" },
    //     { status: 400 }
    //   );
    // }

    // Ensure no duplicate city selections
    if (new Set(cityIds).size !== cityIds.length) {
      return NextResponse.json(
        { success: false, error: "Each cop must select a different city" },
        { status: 400 }
      );
    }

    // Check if vehicles are available and have sufficient range
    for (const cop of parsedData.data) {
      const city = cities.find((c: { id: string; }) => c.id === cop.cityId);
      const vehicle = vehicles.find((v: { id: string; }) => v.id === cop.vehicleId);

      if (!city || !vehicle) {
        return NextResponse.json(
          { success: false, error: "Invalid city or vehicle selection" },
          { status: 400 }
        );
      }

      if (vehicle.range < city.distance * 2) {
        return NextResponse.json(
          { success: false, error: `Vehicle ${vehicle.type} has insufficient range for the trip` },
          { status: 400 }
        );
      }

      const vehicleUsageCount = await prisma.cop.count({ where: { vehicleId: vehicle.id } });

      if (vehicleUsageCount > vehicle.count) {
        console.log("Vehicle out of stock:", vehicle.type, vehicleUsageCount, vehicle.count);
        return NextResponse.json(
          { success: false, error: `Vehicle ${vehicle.type} is no longer available` },
          { status: 400 }
        );
      }
    }

    // Save all cops in one transaction
    const savedCops = await prisma.$transaction(
      parsedData.data.map((cop) =>
        prisma.cop.create({
          data: {
            name: cop.copName,
            cityId: cop.cityId,
            vehicleId: cop.vehicleId,
            gameSessionId: sessionObjectId.toHexString(),
          },
        })
      )
    );

    return NextResponse.json({ success: true, cops: savedCops });
  } catch (error) {
    console.error("Error selecting cops:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
