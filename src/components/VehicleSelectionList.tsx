"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { cn } from "@/app/utils/utils";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface Vehicle {
  id: string;
  type: string;
  range: number;
  count: number;
  imageUrl: string;
}

interface City {
  id: string;
  name: string;
}

export function VehicleSelectionList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVehicles, setSelectedVehicles] = useState<Record<string, string>>({});
  const [vehicleUsage, setVehicleUsage] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Retrieve sessionStorage data inside useEffect to avoid server-side errors
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCities = JSON.parse(sessionStorage.getItem("selectedCities") || "[]");
      const sessionId = sessionStorage.getItem("gameSessionId");

      setSelectedCityIds(storedCities);
      setGameSessionId(sessionId);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [vehicleRes, cityRes] = await Promise.all([
          fetch("/api/vehicles"),
          fetch("/api/cities"),
        ]);

        const vehicleData = await vehicleRes.json();
        const cityData = await cityRes.json();

        setVehicles(
          vehicleData.vehicles.map((vehicle: any) => ({
            id: vehicle.id,
            type: vehicle.type,
            range: vehicle.range,
            count: vehicle.count,
            imageUrl: `/vehicles/${vehicle.type.toLowerCase().replace(/\s+/g, "-")}.jpg`,
          }))
        );

        setCities(cityData.cities);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getCityName = (cityId: string) => {
    const city = cities.find((c) => c.id === cityId);
    return city ? city.name : "Unknown City";
  };

  const handleSelect = (copIndex: number, vehicleId: string) => {
    const cityId = selectedCityIds[copIndex];

    // Get vehicle details
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return;

    const currentCount = vehicleUsage[vehicleId] || 0;

    // Prevent over-selecting beyond the available count
    if (currentCount >= vehicle.count) {
      toast({
        title: "Vehicle Unavailable",
        description: `Only ${vehicle.count} available.`,
        variant: "destructive",
      });
      return;
    }

    // Update selection & count
    setSelectedVehicles((prev) => ({
      ...prev,
      [cityId]: vehicleId,
    }));

    setVehicleUsage((prev) => ({
      ...prev,
      [vehicleId]: currentCount + 1,
    }));

    toast({
      title: `Cop ${copIndex + 1} Vehicle Selected`,
      description: `Selected ${vehicle.type} for ${getCityName(cityId)}`,
    });
  };

  const handleSubmit = async () => {
    console.log("🚀 Submit button clicked!");
  
    if (!gameSessionId) {
      console.log("🚀 Submit button clicked but no game session!");
      toast({
        title: "Game Session Error",
        description: "Game session ID is missing.",
        variant: "destructive",
      });
      return;
    }
  
    if (Object.keys(selectedVehicles).length !== selectedCityIds.length) {
      toast({
        title: "Selection Incomplete",
        description: "All cops must select a vehicle.",
        variant: "destructive",
      });
      return;
    }
  
    setSubmitting(true);
  
    const copSelections = selectedCityIds.map((cityId: string | number, index: number) => ({
      copName: `Cop ${index + 1}`,
      cityId,
      vehicleId: selectedVehicles[cityId],
    }));
  
    console.log("🔍 Cop Selections:", copSelections);
    console.log("🆔 Game Session ID:", gameSessionId);
  
    try {
      const res = await fetch("/api/cop-selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameSessionId, cops: copSelections }),
      });
  
      const responseData = await res.json();
      console.log("🌍 API Response:", responseData);
  
      if (!res.ok) {
        toast({
          title: "Submission Failed",
          description: responseData.error || "Something went wrong.",
          variant: "destructive",
        });
        throw new Error("Failed to submit selection");
      }
  
      console.log("✅ Submission successful!");
      setTimeout(() => {
        setSubmitting(false);
        router.push("/result");
      }, 3000);
    } catch (error) {
      console.error("❌ Submission error:", error);
      setSubmitting(false);
    }
  };
    

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen text-center animate-fade-in">
      <h2 className="text-4xl font-bold mb-8 animate-fade-in">Select Vehicles for Each Cop</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-64 h-64" />
          ))}
        </div>
      ) : (
        <div className="max-w-6xl w-full">
          {selectedCityIds.map((cityId: string, index: number) => (
            <div key={cityId} className="mb-10">
              <h3 className="text-xl font-semibold mb-4">
                Cop {index + 1} - {getCityName(cityId)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => {
                  const isSelected = selectedVehicles[cityId] === vehicle.id;
                  return (
                    <div
                      key={vehicle.id}
                      onClick={() => handleSelect(index, vehicle.id)}
                      className={cn(
                        "relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-64 w-full transition-all duration-300 ease-out cursor-pointer rounded-xl shadow-lg",
                        isSelected ? "border-4 border-emerald-500 scale-105 rounded-xl" : "blur-sm hover:blur-none"
                      )}
                    >
                      <Image
                        src={vehicle.imageUrl}
                        alt={vehicle.type}
                        fill
                        className="object-cover absolute inset-0 transition-all duration-300 rounded-lg"
                      />

                      {/* Availability Count */}
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                        {vehicle.count} Available
                      </div>

                      {/* Range Badge */}
                      <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-lg shadow-md">
                        🔋 {vehicle.range} KM
                      </div>

                      {/* Vehicle Name */}
                      <div className="absolute inset-0 flex flex-col justify-end py-6 px-4 transition-opacity duration-300">
                        <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                          {vehicle.type}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-10 w-full max-w-lg space-x-4">
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selectedVehicles).length !== selectedCityIds.length || submitting}
          className={`px-6 py-3 rounded-lg font-semibold transition hover:scale-105 flex items-center gap-2
            ${Object.keys(selectedVehicles).length === selectedCityIds.length ? "bg-emerald-500 text-white" : "bg-gray-400 text-gray-300 cursor-not-allowed"}`}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
