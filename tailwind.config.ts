import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette')

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f9fafb',
          dark: '#000000',
        },
        foreground: {
          light: '#1a1a1a',
          dark: '#f9fafb',
        },
        'dark-purple': '#6B21A8',
        button: {
          light: '#6B21A8',
          dark: '#6B21A8',
        },
        primary: {
          DEFAULT: '#6366f1',
          foreground: '#ffffff',
        },
        'color-1': 'hsl(var(--color-1))',
        'color-2': 'hsl(var(--color-2))',
        'color-3': 'hsl(var(--color-3))',
        'color-4': 'hsl(var(--color-4))',
        'color-5': 'hsl(var(--color-5))',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        gradient: 'gradient 8s linear infinite',
        meteor: 'meteor 5s linear infinite',
        grid: 'grid 15s linear infinite',
        marquee: 'marquee var(--duration) infinite linear',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
        'shiny-text': 'shiny-text 8s infinite',
        'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
        ripple: 'ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite',
        rippling: 'rippling var(--duration, 0.6s) ease-out',
        line: 'line 2s linear infinite',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        orbit: 'orbit calc(var(--duration)*1s) linear infinite',
        'background-position-spin': 'background-position-spin 3000ms infinite alternate',
        shine: 'shine var(--duration) infinite linear',
        pulse: 'pulse var(--duration) ease-out infinite',
        rainbow: 'rainbow var(--speed, 2s) infinite linear',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-in-left': 'slide-in-from-left var(--slide-duration, 0.25s) ease-out',
        'slide-in-right': 'slide-in-from-right var(--slide-duration, 0.25s) ease-out',
        'slide-in-bottom': 'slide-in-from-bottom var(--slide-duration, 0.25s) ease-out',
      },
      keyframes: {
        'aurora-border': {
          '0%, 100%': { borderRadius: '37% 29% 27% 27% / 28% 25% 41% 37%' },
          '25%': { borderRadius: '47% 29% 39% 49% / 61% 19% 66% 26%' },
          '50%': { borderRadius: '57% 23% 47% 72% / 63% 17% 66% 33%' },
          '75%': { borderRadius: '28% 49% 29% 100% / 93% 20% 64% 25%' },
        },
        'aurora-1': {
          '0%, 100%': { top: '0', right: '0' },
          '50%': { top: '50%', right: '25%' },
          '75%': { top: '25%', right: '50%' },
        },
        'aurora-2': {
          '0%, 100%': { top: '0', left: '0' },
          '60%': { top: '75%', left: '25%' },
          '85%': { top: '50%', left: '50%' },
        },
        'aurora-3': {
          '0%, 100%': { bottom: '0', left: '0' },
          '40%': { bottom: '50%', left: '25%' },
          '65%': { bottom: '25%', left: '50%' },
        },
        'aurora-4': {
          '0%, 100%': { bottom: '0', right: '0' },
          '50%': { bottom: '25%', right: '40%' },
          '90%': { bottom: '50%', right: '25%' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'background-position-spin': {
          '0%': { backgroundPosition: 'top center' },
          '100%': { backgroundPosition: 'bottom center' },
        },
        gradient: {
          to: {
            backgroundPosition: 'var(--bg-size) 0',
          },
        },
        meteor: {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': {
            transform: 'rotate(215deg) translateX(-500px)',
            opacity: '0',
          },
        },
        grid: {
          '0%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        'spin-around': {
          '0%': {
            transform: 'translateZ(0) rotate(0)',
          },
          '15%, 35%': {
            transform: 'translateZ(0) rotate(90deg)',
          },
          '65%, 85%': {
            transform: 'translateZ(0) rotate(270deg)',
          },
          '100%': {
            transform: 'translateZ(0) rotate(360deg)',
          },
        },
        ripple: {
          '0%, 100%': {
            transform: 'translate(-50%, -50%) scale(1)',
          },
          '50%': {
            transform: 'translate(-50%, -50%) scale(0.9)',
          },
        },
        rippling: {
          '0%': {
            opacity: '1',
          },
          '100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        'shimmer-slide': {
          to: {
            transform: 'translate(calc(100cqw - 100%), 0)',
          },
        },
        line: {
          '0%': { 'mask-position-x': '0%' },
          '100%': { 'mask-position-x': '100%' },
        },
        'border-beam': {
          '100%': {
            'offset-distance': '100%',
          },
        },
        'shiny-text': {
          '0%, 90%, 100%': {
            'background-position': 'calc(-100% - var(--shiny-width)) 0',
          },
          '30%, 60%': {
            'background-position': 'calc(100% + var(--shiny-width)) 0',
          },
        },
        'slide-in-from-left': {
          '0%': {
            transform: 'translateX(-100px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'slide-in-from-right': {
          '0%': {
            transform: 'translateX(100px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'slide-in-from-bottom': {
          '0%': {
            transform: 'translateY(100px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        orbit: {
          '0%': {
            transform: 'rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)',
          },
        },
        shine: {
          '0%': {
            'background-position': '0% 0%',
          },
          '50%': {
            'background-position': '100% 100%',
          },
          to: {
            'background-position': '0% 0%',
          },
        },
        pulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 var(--pulse-color)' },
          '50%': { boxShadow: '0 0 0 8px var(--pulse-color)' },
        },
        rainbow: {
          '0%': { 'background-position': '0%' },
          '100%': { 'background-position': '200%' },
        },
        'slide-in': {
          from: {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate, addVariablesForColors],
}
export default config

function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme('colors'))
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  )

  addBase({
    ':root': newVars,
  })
}
