"use client";

import { useState, useEffect } from "react";
import ResultSection from "@/components/ResultSection";
import { WorldMap } from "@/components/ui/world-map";

export default function ResultPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 5000); // Show world map for 5 seconds
    }, []);

    return loading ? (
        <div className="flex justify-center items-center min-h-screen">
            <WorldMap dots={[
                {
                    start: {
                        lat: 64.2008,
                        lng: -149.4937,
                    }, // Alaska (Fairbanks)
                    end: {
                        lat: 34.0522,
                        lng: -118.2437,
                    }, // Los Angeles
                },
                {
                    start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
                    end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                },
                {
                    start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                    end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
                },
                {
                    start: { lat: 51.5074, lng: -0.1278 }, // London
                    end: { lat: 28.6139, lng: 77.209 }, // New Delhi
                },
                {
                    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                    end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
                },
                {
                    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                    end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
                },
            ]} />
        </div>
    ) : (
        <ResultSection />
    );
}
