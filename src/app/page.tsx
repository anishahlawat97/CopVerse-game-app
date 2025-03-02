"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Particles from "@/components/magicui/particles";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Image from "next/image";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const startGame = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/game/start", { method: "POST" });
      const data = await res.json();

      if (!data.success) {
        console.error("Error starting game:", data.error);
        setLoading(false);
        return;
      }

      // Store gameSessionId in session storage
      sessionStorage.setItem("gameSessionId", data.gameSessionId);

      // Redirect to city selection
      router.push("/city-selection");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-background dark:bg-black text-foreground dark:text-white">
      {/* Background Image - Light & Dark Mode */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/backgrounds/cityscape-light.jpg"
          alt="Cityscape Light Mode"
          layout="fill"
          objectFit="cover"
          className="dark:hidden opacity-0"
          priority
        />
        <Image
          src="/backgrounds/cityscape-dark.jpg"
          alt="Cityscape Dark Mode"
          layout="fill"
          objectFit="cover"
          className="hidden dark:block opacity-0"
          priority
        />
        {/* Gradient Overlay for Better Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
      </div>

      {/* Particle Effects */}
      <Particles className="absolute inset-0" quantity={300} color="#ffffff" />

      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(220, 100%, 70%, .15) 0, hsla(220, 100%, 50%, .07) 50%, hsla(220, 100%, 40%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(0, 100%, 70%, .12) 0, hsla(0, 100%, 50%, .05) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(0, 100%, 65%, .1) 0, hsla(0, 100%, 45%, .04) 80%, transparent 100%)"
        translateY={-250}
        width={600}
        height={1400}
        smallWidth={260}
        duration={5}
        xOffset={80}
      />

      {/* Hero Heading */}
      <h1 className="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium leading-tight tracking-tighter text-transparent sm:leading-none animate-fade-in opacity-0 [--animation-delay:200ms]">
        🚔 CopVerse: Capture the Fugitive!
      </h1>

      {/* Subheading with Sparkles Effect */}
      <TextGenerateEffect
        words="A high-stakes chase across the city. Can you catch the fugitive before they disappear forever?"
        className="mt-4 text-sm sm:text-lg md:text-xl text-foreground/70 dark:text-foreground/70 animate-fade-in opacity-0 [--animation-delay:300ms]"
      />

      {/* Call to Action Button */}
      <div className="mt-8 animate-fade-in opacity-0 [--animation-delay:400ms]">
        <HoverBorderGradient onClick={startGame}>
          <span className="whitespace-pre-wrap text-sm sm:text-base md:text-lg lg:text-xl leading-none tracking-tight text-white">
            {loading ? "Starting..." : "Start the Chase"}
          </span>
        </HoverBorderGradient>
      </div>
    </div>
  );
}
