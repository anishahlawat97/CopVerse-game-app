import { LoaderCircle } from 'lucide-react'
import React from 'react'

export type SpinnerProps = {
  size?: string;
  color?: string;
  className?: string;
}

export default function Spinner({ size = 'w-6 h-6', color = 'text-gray-500', className = '' }: SpinnerProps) {
  return (
    <div className={`${size} mx-auto my-3 animate-spin ${color} ${className}`}>
      <LoaderCircle />
    </div>
  )
}