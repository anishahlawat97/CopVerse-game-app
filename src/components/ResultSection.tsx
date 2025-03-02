"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BackgroundLines } from "@/components/ui/background-lines";
import { cn } from "@/app/utils/utils";
import SparklesText from "@/components/magicui/sparkles-text";
import Particles from "@/components/magicui/particles";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import DotPattern from "@/components/magicui/dot-pattern";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { BorderBeam } from "@/components/magicui/border-beam";
import { useTheme } from "next-themes";

interface WinnerData {
  name: string;
  cityId: string;
}

interface ResultData {
  success: boolean;
  message: string;
  winners: WinnerData[] | null;
}

export default function ResultPage() {
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    async function fetchResult() {
      const gameSessionId = sessionStorage.getItem("gameSessionId");

      if (!gameSessionId) {
        console.error("No gameSessionId found");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/game/result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameSessionId }),
        });

        if (!res.ok) throw new Error("Failed to fetch results");

        const data = await res.json();
        setResult(data);
      } catch (error) {
        console.error("Failed to fetch result:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background dark:bg-background px-6">
      {/* Background Patterns */}
      {resolvedTheme === "dark" ? (
        <AnimatedGridPattern className="absolute inset-0 opacity-50 z-0" />
      ) : (
        <DotPattern className="absolute inset-0 opacity-50 z-0" />
      )}

      {/* Particles */}
      <Particles className="absolute inset-0" quantity={100} ease={80} color={resolvedTheme === "dark" ? "#ffffff" : "#000000"} refresh />

      {/* Border Beam */}
      <BorderBeam className="absolute inset-0" size={250} borderWidth={2} />

      {/* Centered Background Lines */}
      <BackgroundLines
        className="absolute inset-0 flex items-center justify-center opacity-40 z-[-1]"
        svgOptions={{ duration: 12 }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative w-full max-w-lg text-center z-10"
      >
        {loading ? (
          <p className="text-lg animate-pulse">Loading results...</p>
        ) : result?.winners && result.winners.length > 0 ? (
          // Winner Case (Cop Caught Fugitive)
          <div className="relative w-full">
            <div className="p-8 rounded-xl shadow-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-700 relative w-full">
              <SparklesText text="🚔 The Fugitive was Captured!" className="text-3xl font-bold text-emerald-500" />
              <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                {result.winners.length === 1 ? (
                  <>
                    Officer <span className="font-semibold">{result.winners[0].name}</span> successfully caught the fugitive!
                  </>
                ) : (
                  <>
                    The fugitive was captured by{" "}
                    {result.winners.map((cop, index) => (
                      <span key={index} className="font-semibold">
                        {cop.name}
                        {index !== (result.winners?.length ?? 0) - 1 ? ", " : ""}
                      </span>
                    ))}
                    !
                  </>
                )}
              </p>

              <div className="mt-6 flex items-center justify-center">
                <Image src="/gifs/caught.gif" alt="Fugitive Caught" width={200} height={120} className="rounded-lg shadow-lg" />
              </div>

              {/* Display all winning cops */}
              <div className="mt-6 flex justify-center gap-4">
                {result.winners.map((cop, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <Image
                      src={`/cops/${cop.name.toLowerCase().replace(/\s+/g, "-")}.png`}
                      alt={cop.name}
                      width={80}
                      height={80}
                      className="rounded-full border-4 border-emerald-500 shadow-lg"
                    />
                    <p className="mt-2 text-sm font-medium">{cop.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Loser Case (Fugitive Escaped)
          <div className="relative w-full">
            <div className="p-8 rounded-xl shadow-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-700 relative w-full">
              <p className="text-3xl font-bold text-red-500">🚨 The Fugitive Escaped!</p>
              <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">The fugitive managed to escape! Better luck next time.</p>
              <div className="mt-6 flex items-center justify-center">
                <Image src="/gifs/escaped.gif" alt="Fugitive Escaped" width={200} height={120} className="rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <ShimmerButton onClick={() => router.push("/")} className="text-white bg-background dark:bg-background dark:text-foreground">
          🏠 Home
        </ShimmerButton>
        <ShimmerButton onClick={() => router.push("/city-selection")} className="text-white bg-background dark:bg-background dark:text-foreground">
          🔄 Try Again
        </ShimmerButton>
      </div>
    </div>
  );
}
