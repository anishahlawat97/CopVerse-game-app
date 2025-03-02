'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BackgroundLines } from '@/components/ui/background-lines'
import SparklesText from '@/components/magicui/sparkles-text'
import Particles from '@/components/magicui/particles'
import AnimatedGridPattern from '@/components/magicui/animated-grid-pattern'
import DotPattern from '@/components/magicui/dot-pattern'
import ShimmerButton from '@/components/magicui/shimmer-button'
import { BorderBeam } from '@/components/magicui/border-beam'
import { useTheme } from 'next-themes'

export default function ResultPage() {
  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    async function fetchResult() {
      const gameSessionId = sessionStorage.getItem('gameSessionId')

      if (!gameSessionId) {
        console.error('No gameSessionId found')
        setLoading(false)
        return
      }

      try {
        const res = await fetch('/api/game/result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameSessionId }),
        })

        if (!res.ok) throw new Error('Failed to fetch results')

        const data = await res.json()
        setResult(data)
      } catch (error) {
        console.error('Failed to fetch result:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background dark:bg-background px-4 md:px-6">
      {/* Background Patterns */}
      {resolvedTheme === 'dark' ? (
        <AnimatedGridPattern className="absolute inset-0 opacity-50 z-0" />
      ) : (
        <DotPattern className="absolute inset-0 opacity-50 z-0" />
      )}

      {/* Particles */}
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={resolvedTheme === 'dark' ? '#ffffff' : '#000000'}
        refresh
      />

      {/* Border Beam */}
      <BorderBeam className="absolute inset-0" size={250} borderWidth={2} />

      {/* Centered Background Lines */}
      {result?.winners && result.winners.length > 0 && (
        <BackgroundLines
          className="absolute inset-0 flex items-center justify-center opacity-40 z-[-1]"
          svgOptions={{ duration: 12 }}
          children={undefined}
        />
      )}

      {/* Main Content with Dynamic Scaling */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative w-full max-w-7xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
      >
        {loading ? (
          <p className="text-lg animate-pulse">Loading results...</p>
        ) : result?.winners && result.winners.length > 0 ? (
          <div className="relative flex flex-col md:flex-row items-center justify-center w-full gap-6 md:gap-16">
            {/* Hide images on smaller screens */}
            <div className="hidden md:flex justify-center items-center">
              {/* Cop Image - Left */}
              <motion.div
                className="relative w-[clamp(160px,18vw,300px)] h-[clamp(200px,26vh,400px)] shadow-lg rounded-xl overflow-hidden flex-shrink-0"
                style={{
                  transform: 'perspective(1400px) rotateY(15deg)', // Curved Effect (Left)
                }}
              >
                <Image
                  src={`/cops/${result.winners[0].name.toLowerCase().replace(/\s+/g, '-')}.png`}
                  alt="Cop"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                />
              </motion.div>
            </div>

            {/* Dynamic Result Card - Center */}
            <motion.div
              className="p-6 md:p-8 rounded-xl shadow-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-700 text-center 
              w-[clamp(280px,55vw,600px)] max-h-[90vh] flex flex-col items-center justify-center overflow-hidden"
              style={{
                transform: 'perspective(1400px) rotateY(-3deg)', // Slight inward curve
              }}
            >
              <SparklesText
                text="🚔 The Fugitive was Captured!"
                className="text-lg md:text-2xl lg:text-3xl font-bold text-emerald-500"
              />
              <p className="mt-3 text-sm md:text-lg text-gray-700 dark:text-gray-300 leading-tight md:leading-snug">
                {result.winners.length === 1 ? (
                  <>
                    Officer <span className="font-semibold">{result.winners[0].name}</span>{' '}
                    successfully caught the fugitive!
                  </>
                ) : (
                  <>
                    The fugitive was captured by{' '}
                    {result.winners.map((cop, index) => (
                      <span key={index} className="font-semibold">
                        {cop.name}
                        {index !== (result.winners?.length ?? 0) - 1 ? ', ' : ''}
                      </span>
                    ))}
                    !
                  </>
                )}
              </p>

              <div className="mt-4 flex items-center justify-center">
                <Image
                  src="/gifs/caught.gif"
                  alt="Fugitive Caught"
                  width={140}
                  height={90}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </motion.div>

            {/* Hide images on smaller screens */}
            <div className="hidden md:flex justify-center items-center">
              {/* Criminal Image - Right */}
              <motion.div
                className="relative w-[clamp(160px,18vw,300px)] h-[clamp(200px,26vh,400px)] shadow-lg rounded-xl overflow-hidden flex-shrink-0"
                style={{
                  transform: 'perspective(1400px) rotateY(-15deg)', // Curved Effect (Right)
                }}
              >
                <Image
                  src="/cops/fugitive.png"
                  alt="Criminal"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                />
              </motion.div>
            </div>
          </div>
        ) : (
          // Loser Case (Fugitive Escaped)
          <div className="relative w-full text-center">
            <div className="p-8 rounded-xl shadow-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-700 relative">
              <p className="text-3xl font-bold text-red-500">🚨 The Fugitive Escaped!</p>
              <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                The fugitive managed to escape! Better luck next time.
              </p>
              <div className="mt-6 flex items-center justify-center">
                <Image
                  src="/gifs/escaped.gif"
                  alt="Fugitive Escaped"
                  width={200}
                  height={120}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <ShimmerButton
          onClick={() => router.push('/')}
          className="text-white bg-background dark:bg-background dark:text-foreground"
        >
          🏠 Home
        </ShimmerButton>
        <ShimmerButton
          onClick={() => router.push('/city-selection')}
          className="text-white bg-background dark:bg-background dark:text-foreground"
        >
          🔄 Try Again
        </ShimmerButton>
      </div>
    </div>
  )
}
